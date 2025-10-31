import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import Book from '#models/book'
import { commentValidator } from '#validators/comment'

export default class CommentsController {
  // Show all comments from a book --> /books/#id/comments
  async index({ params, response }: HttpContext) {
    // Retrieving comments with the book_id
    const book = await Book.findOrFail(params.book_id)

    //Loading of comments and users
    await book.load('comment', (query) => {
      query.preload('user')
    })

    return response.ok(book.comment)
  }

  // Add a new comment to a book
  async store({ params, request, response, auth }: HttpContext) {
    const { content } = await request.validateUsing(commentValidator)

    // Recovery of the authenticated user
    const user = auth.user!
    const userId = user.id

    // Create the comment
    const commentaire = await Comment.create({
      content,
      bookId: params.book_id,
      userId,
    })

    return response.created(commentaire)
  }
}
