//All books from a user
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserBooksController {
  async index({ params, response, auth }: HttpContext) {
    // Retrieve the user whose ID is in the parameter
    const user = await User.findOrFail(params.user_id)

    const currentUser = auth.user!
    const userId = currentUser.id

    if (user.id !== userId && user.isAdmin == false) {
      return response.forbidden('You can only access your own list')
    }

    // Loading books
    await user.load('book')
    return response.ok(user.book)
  }
}
