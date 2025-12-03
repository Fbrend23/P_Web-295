import type { HttpContext } from '@adonisjs/core/http'

import Evaluation from '#models/evaluation'
import Book from '#models/book'
import { evaluationValidator } from '#validators/evaluation'
import db from '@adonisjs/lucid/services/db'

export default class EvaluationsController {
  // Show all evaluations of a book --> /books/#id/evaluation
  async index({ params, response }: HttpContext) {
    // Retrieving evaluations with the book_id
    const book = await Book.findOrFail(params.book_id)

    // Loading evaluations and users
    await book.load('evaluation')

    // Calculation of the average evaluation and the number of evaluations
    const evaluations = book.evaluation.map((x) => x.note)
    const count = evaluations.length
    const average = count > 0 ? evaluations.reduce((a, b) => a + b) / evaluations.length : null

    return response.ok({average, count})
  }

  async store({ params, request, response, auth }: HttpContext) {
    const { note } = await request.validateUsing(evaluationValidator)
    const user = auth.user!
    const userId = user.id

    // Checks that the user has not already evaluate this book
    const alreadyExistingEvaluation = await db
      .query()
      .from('evaluations')
      .select('*')
      .where('user_id', userId)
      .where('book_id', params.book_id)

    if (alreadyExistingEvaluation.length > 0) {
      return response
        .status(409)
        .json({ error: "You can't add another evaluation to a book if you already have one." })
    }

    // Creating an evaluation
    const evaluation = await Evaluation.create({
      note,
      bookId: params.book_id,
      userId,
    })

    return response.created(evaluation)
  }
}
