import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('book_id').notNullable().unique()
      table.string('title', 255).notNullable().unique()
      table.tinyint('number_of_pages').notNullable()
      table.string('pdf_link', 255).nullable().unique()
      table.text('abstract').notNullable()
      table.string('editor').notNullable()
      table.tinyint('edition_year').notNullable()
      table.string('image_path', 255).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
