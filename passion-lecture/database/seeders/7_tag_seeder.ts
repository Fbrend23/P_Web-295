import Tag from '#models/tag'
import { BaseSeeder } from '@adonisjs/lucid/seeders'


export default class extends BaseSeeder {
  async run() {
    await Tag.createMany([
      { name: 'Fantasy' },
      { name: 'Aventure' },
      { name: 'Science-fiction' },
      { name: 'Histoire' },
    ])
  }
}