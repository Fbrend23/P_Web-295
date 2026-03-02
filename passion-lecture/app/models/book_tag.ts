import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Book from './book.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tag from './tag.js'

export default class BookTag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // FK
  @column()
  declare bookId: number

  @column()
  declare tagId: number

  @belongsTo(() => Book)
  declare book: BelongsTo<typeof Book>

  @belongsTo(() => Tag)
  declare tag: BelongsTo<typeof Tag>
}
