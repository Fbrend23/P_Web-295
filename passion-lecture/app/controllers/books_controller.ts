import Book from '#models/book'
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
      query.where('category_fk', categoryId)
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

  async store({ request, response, auth}: HttpContext) {
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

    // Récupération de l'utilisateur authentifié
    const user = auth.user!
    const userId = user.id;

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
    const books = await Book.findOrFail(params.id)
    return response.ok(books)
  }

  async update({ params, request, response }: HttpContext) {
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

    const book = await Book.findOrFail(params.id)

    ///VERIFIER QUE C'EST L'USER QUI A CREE QUI LE MODIFIE

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

  async destroy({ params, response }: HttpContext) {
    const book = await Book.findOrFail(params.id)
    // delete
      
    ///VERIFIER QUE C'EST L'USER QUI A CREE QUI LE DETRUIT

    await book.delete()
    return response.noContent()
  }
}
