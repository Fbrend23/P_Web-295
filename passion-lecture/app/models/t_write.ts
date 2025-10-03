import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TWrite extends BaseModel {
  @column({ isPrimary: true })
  declare id_writer: number

  @column({ isPrimary: true })
  declare last_name: string

  @column({ isPrimary: true })
  declare first_name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
