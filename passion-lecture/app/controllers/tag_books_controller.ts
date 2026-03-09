import { HttpContext } from '@adonisjs/core/http'
import BookTag from '#models/book_tag'
import Book from '#models/book'
import Tag from '#models/tag'

export default class BookTagsController {
  /**
   * ADD A TAG TO A BOOK
   * Route: POST /books/:book_id/tags/:tag_id
   */
  public async store({ params, response }: HttpContext) {
    const { book_id, tag_id } = params

    // 1. Safeguard: Check if both the Book and the Tag actually exist
    const bookExists = await Book.find(book_id)
    const tagExists = await Tag.find(tag_id)

    if (!bookExists || !tagExists) {
      return response.notFound({
        error: !bookExists ? 'Book not found' : 'Tag not found',
      })
    }

    // 2. Safeguard: Check if the link already exists (avoid duplicates)
    const existingLink = await BookTag.query()
      .where('bookId', book_id)
      .where('tagId', tag_id)
      .first()

    if (existingLink) {
      return response.conflict({ message: 'This book is already linked to this tag' })
    }

    // 3. Create the link using your BookTag model
    const link = await BookTag.create({
      bookId: book_id,
      tagId: tag_id,
    })

    return response.created(link)
  }

  /**
   * GET ALL BOOKS FOR A SPECIFIC TAG
   * Route: GET /tags/:tag_id/books
   */
  public async show({ params, response }: HttpContext) {
    const { tag_id } = params

    const tag = await Tag.find(tag_id)
    if (!tag) {
      return response.notFound({ error: 'Tag not found' })
    }

    // Correction ici : On descend dans la relation 'book' pour charger ses propres relations
    const taggedBooks = await BookTag.query()
      .where('tagId', tag_id)
      .preload('book', (bookQuery) => {
        bookQuery.preload('author') // <--- IMPORTANT : Charge l'auteur du livre
        bookQuery.preload('category') // <--- IMPORTANT : Charge la catégorie du livre
      })
      .exec()

    const books = taggedBooks.map((bt) => bt.book)

    return response.ok(books)
  }

  /**
   * REMOVE A TAG FROM A BOOK
   * Route: DELETE /books/:book_id/tags/:tag_id
   */
  public async destroy({ params, response }: HttpContext) {
    const { book_id, tag_id } = params

    // 1. Safeguard: Check if the link actually exists in the BookTag model
    // We use a query builder to find the specific row matching both IDs
    const link = await BookTag.query().where('bookId', book_id).where('tagId', tag_id).first()

    // 2. Safeguard: If no link is found, return 404
    if (!link) {
      return response.notFound({
        message: 'This tag is not associated with this book, so it cannot be removed.',
      })
    }

    // 3. Delete the specific record
    await link.delete()

    // 4. Return a clean success response
    return response.ok({
      message: 'Tag successfully removed from book',
      deleted_at: new Date().toISOString(),
    })
  }
}
