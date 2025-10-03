import Author from '#models/author'
import { authorValidator } from '#validators/author'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthorsController {
  // Show all authors
  async index({ response }: HttpContext) {
    const authors = await Author.query().orderBy('lastName').orderBy('firstName')
    return response.ok(authors)
  }

  // Creates an author and add it to the db
  async store({ request, response }: HttpContext) {
    // Get data sent by user and validate the data
    const { firstName, lastName } = await request.validateUsing(authorValidator)

    // Creates an author
    const author = await Author.create({ firstName, lastName })

    // return 201 and the new author
    return response.created(author)
  }
}
