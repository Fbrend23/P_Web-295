import Category from '#models/category'
import { categoryValidator } from '#validators/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  // Show all categories
  async index({ response }: HttpContext) {
    // Get all categories and order them by
    const categories = await Category.query().orderBy('label')
    return response.ok(categories)
  }

  // Create a category and add it to the db
  async store({ request, response }: HttpContext) {
    // Get data sent by user and validate data
    const { label } = await request.validateUsing(categoryValidator)

    // Creates a category
    const category = await Category.create({ label })

    // Return 201 and the new category
    return response.created(category)
  }
}
