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
    await book.load('evaluation')

    const evaluations = book.evaluation.map((x) => x.note)

    const average = evaluations.reduce((a, b) => a + b) / evaluations.length

    return response.ok(average)
  }

  async store({ params, request, response, auth}: HttpContext) {
    //TODO validator

    const { note } = await request.validateUsing(evaluationValidator)
    // TODO auth
    // FAIRE EN SORTE QUE UNE EVALUATION PAR LIVRE PAR UTILISATEUR
    const user = auth.user!
    const userId = user.id

    // Création du commentaire

    const evaluation = await Evaluation.create({
      note,
      bookId: params.book_id,
      userId,
    })
    return response.created(evaluation)
  }
}
