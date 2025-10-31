import User from '#models/user'
import Book from '#models/book'
import { BasePolicy } from '@adonisjs/bouncer'

export default class BookPolicy extends BasePolicy {
  private async isOwner(user: User, book: Book): Promise<boolean> {
    const owner = await Book.query()
      .where('id', book.id)
      .where('userId', user.id)
      .select('id')
      .first()
    return !!owner
  }

  // Can update a book
  async update(user: User, book: Book) {
    return user.isAdmin === true || (await this.isOwner(user, book))
  }

  // Can delete a book
  async delete(user: User, book: Book) {
    return user.isAdmin === true || (await this.isOwner(user, book))
  }
}
