import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'

export default class TagsController {
  async store({ request, response }: HttpContext) {
    const { name } = request.body()
    
    // Check that the tag doesn't already exists
    const existing = await Tag.query().where('name', name).first()
    if (existing) {
      return response.conflict({ message: 'Tag already exists' })
    }

    const tag = await Tag.create({ name })
    return response.created(tag)
  }

  // Link all tags
  async index({ response }: HttpContext) {
    const tags = await Tag.query().orderBy('name')
    return response.ok(tags)
  }
}