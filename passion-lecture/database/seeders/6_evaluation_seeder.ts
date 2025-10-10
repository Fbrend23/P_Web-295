import { EvaluationFactory } from '#database/factories/evaluation_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await EvaluationFactory.createMany(15)
  }
}
