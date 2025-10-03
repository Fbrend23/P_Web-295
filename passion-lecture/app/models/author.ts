import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Book from './book.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Author extends BaseModel {
  // Attributs
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare lastName: string

  @column()
  declare firstName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @hasMany(() => Book)
  declare book: HasMany<typeof Book>
}
