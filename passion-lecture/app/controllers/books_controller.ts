import Book from '#models/book'
import BookPolicy from '#policies/book_policy'
import { bookValidator } from '#validators/book'
import { getBooksQueryValidator } from '#validators/get_book_query'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class BooksController {
  async index({ response, request }: HttpContext) {
    const {
      page = 1,
      limit = 10,
      sort = 'title',
      order = 'asc',
      categoryId,
      authorId,
      userId,
      search,
    } = await request.validateUsing(getBooksQueryValidator)

    const query = Book.query().preload('category').preload('author').preload('user')

    //Search filters
    if (categoryId) {
      query.where('category_id', categoryId)
    }

    if (authorId) {
      query.where('author_fk', authorId)
    }

    if (userId) {
      query.where('user_fk', userId)
    }

    // Search on the book title
    if (search) {
      query.where((subQuery) => {
        subQuery.whereILike('title', `%${search}%`) // si possible --> .orWhereILike('author_name', `%${search}%`)
      })
    }
    query.orderBy(sort, order as 'asc' | 'desc')

    const books = await query.paginate(page, limit)

    // Correctly displays the path
    books.baseUrl('/books') // --> needed ???

    // Keeps settings (search, sort, etc.)
    books.queryString({ page, limit, sort, order, categoryId, authorId, userId, search })

    return response.ok(books)
  }

  async store({ request, response, auth }: HttpContext) {
    // Retrieval of data sent by the client and validation of data
    const data = await request.validateUsing(bookValidator)
    let imagePath
    let pdfLink

    // 1. Handle Image
    if (data.image) {
      const fileName = `${cuid}.${data.image.extname}`

      await data.image.move(app.makePath('public/uploads/books/images'), {
        name: fileName,
      })

      imagePath = `/uploads/books/images/${fileName}`
    }

    // 2. Handle PDF
    if (data.pdf) {
      const fileName = `${cuid}.${data.pdf.extname}`

      await data.pdf.move(app.makePath('public/uploads/books/pdf'), {
        name: fileName,
      })

      pdfLink = `/uploads/books/pdf/${fileName}`
    }

    // Recovery of the authenticated user
    const user = auth.user!
    const userId = user.id

    // Creating a new book with validated data
    const book = await Book.create({
      title: data.title,
      authorId: data.authorId,
      categoryId: data.categoryId,
      numberOfPages: data.numberOfPages,
      editor: data.editor,
      editionYear: data.editionYear,
      abstract: data.abstract,
      pdfLink,
      imagePath,
      userId,
    })
    return response.created(book)
  }

  async show({ params, response }: HttpContext) {
    const book = await Book.findOrFail(params.book_id)
    await book.load('author', (query) => {
      query.select('firstName', 'lastName')
    })
    await book.load('user', (query) => {
      query.select('username')
    })
    await book.load('category', (query) => {
      query.select('label')
    })
    return response.ok(book)
  }

  async update({ params, request, response, bouncer }: HttpContext) {
    const data = await request.validateUsing(bookValidator)
    const book = await Book.findOrFail(params.book_id)

    if (await bouncer.with(BookPolicy).denies('update', book)) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    if (data.image) {
      const fileName = `${cuid()}.${data.image.extname}`
      console.log(fileName)

      await data.image.move(app.makePath('public/uploads/books/images'), {
        name: fileName,
      })

      book.imagePath = `/uploads/books/images/${fileName}`
    } else {
      book.imagePath = null
    }

    // 2. Handle PDF
    if (data.pdf) {
      const fileName = `${cuid()}.${data.pdf.extname}`

      await data.pdf.move(app.makePath('public/uploads/books/pdf'), {
        name: fileName,
      })

      book.pdfLink = `/uploads/books/pdf/${fileName}`
    } else {
      book.pdfLink = null
    }

    // 3. Merge other fields (excluding files which we handled above)
    book.merge({
      title: data.title,
      authorId: data.authorId,
      categoryId: data.categoryId,
      numberOfPages: data.numberOfPages,
      editor: data.editor,
      editionYear: data.editionYear,
      abstract: data.abstract,
    })

    await book.save()
    return response.ok(book)
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    const book = await Book.findOrFail(params.book_id)

    // Check permisions of the connected user
    if (await bouncer.with(BookPolicy).denies('delete', book)) {
      return response.unauthorized({
        message: 'You are not the creator of this book. You do not have the right to delete it.',
      })
    }
    await book.delete()
    return response.ok(book)
  }
}
