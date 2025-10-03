import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username').notNullable()
      table.string('hash_password').notNullable()

      table.timestamp('creation_date').notNullable()
      table.timestamp('updated_at').nullable()

      table.boolean('is_admin').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}