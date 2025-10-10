import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import Book from '#models/book'
import { commentValidator } from '#validators/comment'
export default class CommentsController {
  //Afficher tous les commentaires de book_id
  // /books/#id/comments
  async index({ params, response }: HttpContext) {
    //Récupération des commentaire avec le book_id
    const book = await Book.findOrFail(params.book_id)
    //Chargement des commentaire et des users
    await book.load('comment', (query) => {
      query.preload('user')
    })
    return response.ok(book.comment)
  }

  /**
   * Ajouter un nouveau commentaire au bookId
   */
  async store({ params, request, response }: HttpContext) {
    const { content, userId } = await request.validateUsing(commentValidator)
    // TODO auth
    // const user = auth.user!
    // const userId = user.id

    // Création du commentaire

    const commentaire = await Comment.create({
      content,
      bookId: params.book_id,
      userId,
    })
    return response.created(commentaire)
  }
}
