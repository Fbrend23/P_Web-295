import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoryBooksController {
  
       /**
     * Display a list of resource
     */
    async index({ params, response }: HttpContext) {
      //Retrieve the user whose ID is in the parameter
      const category = await Category.findOrFail(params.categoryId)
      // Loading books and
      // for each books, we preload the teacher
      await category.load('book', (query) => {
        // A T'ON BESOIN DE PRELOAD QUELQUE CHOSE ?
      })
      return response.ok(category.book)
    }
}
