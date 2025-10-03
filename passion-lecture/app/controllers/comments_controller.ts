import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'

export default class CommentsController {
  //Afficher tous les commentaires de book_id
  // /books/#id/comments
  async index({ params, response }: HttpContext) {
    //Récupération des commentaire avec le book_id
    const comments = await Comment.findOrFail(params.book_id)
    //Chargement des commentaire et des users
    // await comments.load('comment', (query) => {
    //   query.preload('user')
    // })
    response.ok(comments)
    return comments
  }

  async store({ params, request, response }: HttpContext) {
    //TODO validator

    const { comment } = request.only(['comment'])
    // TODO auth
    // const user = auth.user!
    // const userId = user.id

    // Création du commentaire

    const commentaire = await Comment.create({
      comment,
      bookId: params.book_id,
      //userId
    })
    return response.created(commentaire)
  }
}
