import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Attributs
      table.increments('id').notNullable().unique()
      table.string('label').notNullable().unique()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Relations
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
