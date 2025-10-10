import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        username: 'Nova',
        hashPassword: 'gougougaga',
      },
      {
        username: 'Brendan',
        hashPassword: 'gagagougou',
      },
    ])
  }
}
