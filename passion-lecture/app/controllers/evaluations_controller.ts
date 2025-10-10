import type { HttpContext } from '@adonisjs/core/http'

import Evaluation from '#models/evaluation'
import Book from '#models/book'
import { evaluationValidator } from '#validators/evaluation'

export default class EvaluationsController {
  //Afficher tous les évaluations de book_id
  // /books/#id/evaluation
  async index({ params, response }: HttpContext) {
    //Récupération des commentaire avec le book_id
    const book = await Book.findOrFail(params.book_id)
    //Chargement des commentaire et des users
    await book.load('evaluation', (query) => {
      query.preload('user')
    })
    return response.ok(book.evaluation)
  }

  async store({ params, request, response }: HttpContext) {
    //TODO validator

    const { note } = request.validateUsing(evaluationValidator)
    // TODO auth
    // const user = auth.user!
    // const userId = user.id

    // Création du commentaire

    const evaluation = await Evaluation.create({
      note,
      bookId: params.book_id,
      //userId
    })
    return response.created(evaluation)
  }
}
