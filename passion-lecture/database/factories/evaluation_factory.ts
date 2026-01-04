import factory from '@adonisjs/lucid/factories'
import Evaluation from '#models/evaluation'
import User from '#models/user'
import Book from '#models/book'

export const EvaluationFactory = factory
  .define(Evaluation, async ({ faker }) => {
    const userIds = (await User.all()).map((u) => u.id)
    const bookIds = (await Book.all()).map((b) => b.id)
    return {
      note: faker.number.int({ min: 1, max: 5 }),
      userId: faker.helpers.arrayElement(userIds),
      bookId: faker.helpers.arrayElement(bookIds),
    }
  })
  .build()
