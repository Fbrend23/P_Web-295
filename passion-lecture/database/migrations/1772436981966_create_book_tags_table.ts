import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'book_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      //PK
      table.increments('id')

      // Attributes
      table.timestamp('created_at')
      table.timestamp('updated_at')

      //FK
      table
        .integer('book_id')
        .unsigned()
        .references('id')
        .inTable('books')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('tag_id')
        .unsigned()
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
