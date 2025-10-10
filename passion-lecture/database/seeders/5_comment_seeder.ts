import { CommentFactory } from '#database/factories/comment_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await CommentFactory.createMany(20)
  }
}
