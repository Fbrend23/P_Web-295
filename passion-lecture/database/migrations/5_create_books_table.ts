import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Attributs
      table.increments('id').notNullable().unique()
      table.string('title', 255).notNullable().unique()
      table.integer('number_of_pages').notNullable()
      table.string('pdf_link', 255).nullable().unique()
      table.text('abstract').notNullable()
      table.string('editor').notNullable()
      table.integer('edition_year').notNullable()
      table.string('image_path', 255).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // FK
      // 1 book -> 1 category
      table.integer('category_fk').unsigned().references('id').inTable('categories').notNullable()

      // 1 book -> 1 author
      table.integer('author_fk').unsigned().references('id').inTable('authors').notNullable()

      // 1 book -> 1 user
      table.integer('user_fk').unsigned().references('id').inTable('users').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
