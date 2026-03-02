import Tag from '#models/tag'
import { tagValidator } from '#validators/tag'
import type { HttpContext } from '@adonisjs/core/http'

export default class TagsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const tags = await Tag.query().orderBy('name')
    return response.ok(tags)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { name } = await request.validateUsing(tagValidator)

    const tag = await Tag.create({ name })

    return response.created(tag)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
