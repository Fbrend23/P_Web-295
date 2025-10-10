import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'evaluations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Attributs
      table.integer('note').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Relations
      // 1 comment -> 1 book
      table
        .integer('book_id')
        .unsigned()
        .references('id')
        .inTable('books')
        .onDelete('CASCADE')
        .notNullable()

      // 1 comment -> 1 user
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
