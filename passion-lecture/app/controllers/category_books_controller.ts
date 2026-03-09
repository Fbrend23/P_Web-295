import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoryBooksController {
  async index({ params, response }: HttpContext) {
    // 1. On récupère la catégorie
    const category = await Category.findOrFail(params.category_id)

    // 2. On charge les livres, ET pour chaque livre, on charge son auteur et sa catégorie
    await category.load('book', (bookQuery) => {
      bookQuery.preload('author') // Charge l'objet Author pour chaque livre
      bookQuery.preload('category') // Charge l'objet Category pour chaque livre
    })

    // 3. On retourne la liste des livres (qui contiennent maintenant leurs relations)
    return response.ok(category.book)
  }
}
