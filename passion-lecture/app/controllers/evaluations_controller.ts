import Evaluation from '#models/evaluation'
import type { HttpContext } from '@adonisjs/core/http'

// export default class EvaluationsController {
//   //Afficher toutes les évaluations de book_id
//   async index({ response }: HttpContext) {
//     const evaluation = await Evaluation.query().preload('book').cou
//     response.ok(evaluation)
//     return evaluation
//   }

//   async store({ params, request, response }: HttpContext) {
//     //TODO validator

//     const { comment } = request.only(['comment'])
//     // TODO auth
//     // const user = auth.user!
//     // const userId = user.id

//     // Création du commentaire

//     const commentaire = await Comment.create({
//       comment,
//       bookId: params.book_id,
//       //userId
//     })
//     return response.created(commentaire)
//   }
// }

// }
