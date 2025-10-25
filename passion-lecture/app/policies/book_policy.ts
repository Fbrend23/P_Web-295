import User from '#models/user'
import Book from '#models/book'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class BookPolicy extends BasePolicy {
  private async isOwner(user: User, book: Book): Promise<boolean> {
    const owner = await User.query()
      .where('id', book.userId)
      .where('userId', user.id)
      .select('id')
      .first()
    return !!owner
  }

  // Can update a book
  async update(user: User, book: Book) {
    return user.isAdmin === true || this.isOwner(user, book)
  }

  // Can delete a book
  async delete(user: User, book: Book) {
    return user.isAdmin === true || this.isOwner(user, book)
  }

  /*
  // Peut créer un commentaire (par défaut : tous les enseignants)
  async create(user: User) {
    return user.role === 'teacher' || user.role === 'admin'
  }
  // Peut voir un commentaire (par défaut : tous les enseignants)
  async view(user: User, comment: Comment) {
    return user.role === 'teacher' || user.role === 'admin'
  }
    */
}
