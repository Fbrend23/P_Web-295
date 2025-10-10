import Category from '#models/category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        label: 'Horror',
      },
      {
        label: 'Adventure',
      },
      {
        label: 'Thriller',
      },
    ])
  }
}
