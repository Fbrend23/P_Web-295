import Book from '#models/book'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async show({ params, response }: HttpContext) {
    //Retrieve the user whose ID is in the parameter
    const user = await User.findOrFail(params.id)

    // Loading all the books oth the user 
    const books = await Book.query().where('user_id', user.id)

    // Retrieving the last book created by the user and the number of books created
    const book = await Book.query().where('user_id', user.id).orderBy('created_at', 'desc').limit(1)
    const count = books.length

    // Return the created data
    const data = [user, count, ...book]
    console.log(data)
    return response.ok(data)
  }
}
