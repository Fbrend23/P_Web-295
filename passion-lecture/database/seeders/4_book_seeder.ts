import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Book from '#models/book'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class extends BaseSeeder {
  async run() {
    const booksDir = path.join(process.cwd(), 'database/seeders/files/books')

    // 1️⃣ Read all files in directory
    const files = await fs.readdir(booksDir)

    // 2️⃣ Keep only .epub files
    const epubFiles = files.filter((file) => file.endsWith('.epub'))

    for (const file of epubFiles) {
      const filePath = path.join(booksDir, file)

      // 3️⃣ Read EPUB into buffer
      const epubBuffer = await fs.readFile(filePath)

      // 4️⃣ Derive title from filename
      const title = path
        .basename(file, '.epub')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      await Book.create({
        title,
        numberOfPages: 0, // unknown at seed time
        pdfLink: null,
        abstract: 'Seeded EPUB book',
        editor: 'Unknown',
        editionYear: new Date().getFullYear(),
        imagePath: null,
        epub: epubBuffer, // 👈 stored directly in DB (BLOB)
        categoryId: 1,
        authorId: 3,
        userId: 1,
      })
    }
  }
}
