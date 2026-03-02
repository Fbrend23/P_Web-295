import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'book_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('book_id').unsigned().notNullable().references('id').inTable('books').onDelete('CASCADE')
      table.integer('tag_id').unsigned().notNullable().references('id').inTable('tags').onDelete('CASCADE')
      table.primary(['book_id', 'tag_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}