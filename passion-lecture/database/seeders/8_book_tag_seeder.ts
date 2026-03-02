import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Book from '#models/book'
import Tag from '#models/tag'

export default class extends BaseSeeder {
  async run() {
    // Récupérer tous les livres et tags
    const books = await Book.all()
    const tags = await Tag.all()
    const tagIds = tags.map((t) => t.id)

    for (const book of books) {
      // Sélectionne aléatoirement 1 à 3 tags pour chaque livre
      const shuffled = tagIds.sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, Math.min(3, tagIds.length))

      // Attache les tags au livre
      await book.related('tags').attach(selected)
    }
  }
}