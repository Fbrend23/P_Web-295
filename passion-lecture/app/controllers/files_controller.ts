import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class FilesController {
  async getImage({ response, params }: HttpContext) {
    return response.download(app.makePath('public/uploads/books/images/', params.fileName))
  }
  async getPDF({ response, params }: HttpContext) {
    return response.download(app.makePath('public/uploads/books/pdf/', params.fileName))
  }
}
