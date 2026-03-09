import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Book from '#models/book'
import Author from '#models/author'
import Category from '#models/category'
import fs from 'node:fs/promises'
import path from 'node:path'
import { EPub } from 'epub2'

export default class extends BaseSeeder {
  async run() {
    const booksDir = path.join(process.cwd(), 'database/seeders/files/books')
    const categories = await Category.all()

    if (categories.length === 0) return

    const files = await fs.readdir(booksDir)
    const epubFiles = files.filter((file) => file.endsWith('.epub'))

    for (const file of epubFiles) {
      const filePath = path.join(booksDir, file)
      const epubBuffer = await fs.readFile(filePath)

      const fileNameWithoutExt = path.basename(file, '.epub')
      const mainParts = fileNameWithoutExt.split(' - ')

      let lastName = 'Inconnu'
      let firstName = 'Inconnu'
      let bookTitle = fileNameWithoutExt

      if (mainParts.length >= 2) {
        const authorPart = mainParts[0].split(',')
        lastName = authorPart[0]?.trim() || 'Inconnu'
        firstName = authorPart[1]?.trim() || ''
        bookTitle = mainParts[1].trim()
      }

      const author = await Author.firstOrCreate({ lastName, firstName }, { lastName, firstName })

      const randomCategory = categories[Math.floor(Math.random() * categories.length)]

      let chapterCount = 0
      try {
        // Logique asynchrone pour lire le buffer avec EPub
        const epub = await new Promise<any>((resolve, reject) => {
          const ep = new EPub(filePath) // On passe le path directement
          ep.on('end', () => resolve(ep))
          ep.on('error', (err) => reject(err))
          ep.parse()
        })
        chapterCount = epub.spine.contents.length
      } catch (error) {
        chapterCount = 0
      }

      await Book.create({
        title: bookTitle,
        numberOfPages: chapterCount,
        pdfLink: null,
        abstract: `Ouvrage de ${firstName} ${lastName}`,
        editor: 'Auto-généré',
        editionYear: new Date().getFullYear(),
        imagePath: null,
        epub: epubBuffer,
        categoryId: randomCategory.id,
        authorId: author.id,
        userId: 1,
      })
    }
  }
}
