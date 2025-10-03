import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Evaluation extends BaseModel {
  @column({ isPrimary: true })
  declare idBook: number

  @column({ isPrimary: true })
  declare idUser: number

  @column()
  declare note: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}