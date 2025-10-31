import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoryBooksController {
  async index({ params, response }: HttpContext) {
    //Retrieve the user whose ID is in the parameter
    const category = await Category.findOrFail(params.category_id)
    // Loading books and
    // for each books, we preload the teacher
    await category.load('book')
    return response.ok(category.book)
  }
}
