//All books from a user
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserBooksController {
  async index({ params, response }: HttpContext) {
    // Retrieve the user whose ID is in the parameter
    const user = await User.findOrFail(params.user_id)

    // Loading books
    await user.load('book')
    return response.ok(user.book)
  }
}
