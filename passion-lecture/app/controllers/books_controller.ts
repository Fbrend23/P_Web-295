import Book from '#models/book'
import BookPolicy from '#policies/book_policy'
import { bookValidator } from '#validators/book'
import { getBooksQueryValidator } from '#validators/get_book_query'
import type { HttpContext } from '@adonisjs/core/http'

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
    const {
      title,
      authorId,
      categoryId,
      numberOfPages,
      pdfLink,
      editor,
      editionYear,
      abstract,
      imagePath,
    } = await request.validateUsing(bookValidator)

    // Recovery of the authenticated user
    const user = auth.user!
    const userId = user.id

    // Creating a new book with validated data
    const book = await Book.create({
      title,
      authorId,
      categoryId,
      userId,
      numberOfPages,
      pdfLink,
      editor,
      editionYear,
      abstract,
      imagePath,
    })
    return response.created(book)
  }

  async show({ params, response }: HttpContext) {
    const books = await Book.findOrFail(params.book_id)
    return response.ok(books)
  }

  async update({ params, request, response, bouncer }: HttpContext) {
    // Data recovery
    const {
      title,
      authorId,
      categoryId,
      numberOfPages,
      pdfLink,
      editor,
      editionYear,
      abstract,
      imagePath,
    } = await request.validateUsing(bookValidator)

    const book = await Book.findOrFail(params.book_id)

    // Check the permissions of the logged-in user
    if (await bouncer.with(BookPolicy).denies('update', book)) {
      return response.unauthorized({
        message: 'You are not the creator of this book. You do not have the right to modify it.',
      })
    }

    // Update and save
    book.merge({
      title,
      authorId,
      categoryId,
      numberOfPages,
      pdfLink,
      editor,
      editionYear,
      abstract,
      imagePath,
    })
    await book.save()

    return response.created(book)
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
