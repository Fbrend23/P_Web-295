import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import User from '#models/user'
import Book from '#models/book'

export const CommentFactory = factory
  .define(Comment, async ({ faker }) => {
    const userIds = (await User.all()).map((u) => u.id)
    const bookIds = (await Book.all()).map((b) => b.id)
    return {
      content: "C'est trop bien",
      userId: faker.helpers.arrayElement(userIds),
      bookId: faker.helpers.arrayElement(bookIds),
    }
  })
  .build()
