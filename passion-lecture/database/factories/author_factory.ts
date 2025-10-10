import Factory from '@adonisjs/lucid/factories'
import Author from '#models/author'

export const AuthorFactory = Factory.define(Author, async ({ faker }) => {
  return {
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
  }
}).build()
