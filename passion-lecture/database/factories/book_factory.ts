import factory from '@adonisjs/lucid/factories'
import Book from '#models/book'
import User from '#models/user'
import Category from '#models/category'
import Author from '#models/author'

export const BookFactory = factory
  .define(Book, async ({ faker }) => {
    const userIds = (await User.all()).map((u) => u.id)
    const categoryIds = (await Category.all()).map((c) => c.id)
    const authorIds = (await Author.all()).map((a) => a.id)
    return {
      title: faker.book.title(),
      numberOfPages: faker.number.int({ min: 10, max: 1000 }),
      pdfLink: null,
      abstract: "C'est le livre de la jungle",
      editor: faker.book.publisher(),
      editionYear: faker.number.int({ min: 1800, max: 2025 }),
      imagePath: null,
      userId: faker.helpers.arrayElement(userIds),
      categoryId: faker.helpers.arrayElement(categoryIds),
      authorId: faker.helpers.arrayElement(authorIds),
    }
  })
  .build()
