import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Attributs
      table.increments('comment_id')
      table.string('comment').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Relations
      // 1 comment -> 1 book
      table
        .integer('book_fk')
        .unsigned()
        .references('book_id')
        .inTable('books')
        .onDelete('CASCADE')
        .notNullable()

      // 1 comment -> 1 user
      table
        .integer('user_fk')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
