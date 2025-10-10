//Tous les livres d'un utilisateur
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserBooksController {
      /**
   * Display a list of resource
   */
  async index({ params, response }: HttpContext) {
    //Retrieve the user whose ID is in the parameter
    const user = await User.findOrFail(params.userId)
    // Loading books and
    // for each books, we preload the teacher
    await user.load('book', (query) => {
      // A T'ON BESOIN DE PRELOAD QUELQUE CHOSE ?
    })
    return response.ok(user.book)
  }
}