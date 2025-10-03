import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Comment from './comment.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Evaluation from './evaluation.js'
import Book from './book.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'hashPassword', //à vériier, anciennement 'password'
})

export default class User extends compose(BaseModel, AuthFinder) {
  // Attributs
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare hashPassword: string

  @column.dateTime({ autoCreate: true })
  declare creationDate: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare isAdmin: boolean

  static accessTokens = DbAccessTokensProvider.forModel(User)

  // Relations
  @hasMany(() => Comment)
  declare comment: HasMany<typeof Comment>

  @hasMany(() => Evaluation)
  declare evaluation: HasMany<typeof Evaluation>

  @hasMany(() => Book)
  declare book: HasMany<typeof Book>
}
