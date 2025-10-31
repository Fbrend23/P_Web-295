import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    // User name and password validation
    const { username, hash_password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(username, hash_password)

    // Generate an OAT token
    const token = await User.accessTokens.create(user)

    // Return the token and user's infos
    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    // Create the user
    const user = await User.create(payload)

    // Return user's infos
    return response.created(user)
  }

  async logout({ auth, response }: HttpContext) {
    // Retrieves the logged-in/authenticated user and their token
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier

    // If the token does not exist, return HTTP 400 error
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    // Delete the token
    await User.accessTokens.delete(user, token)

    // Confirm to the user that the logout was successful
    return response.ok({ message: 'Logged out' })
  }
}
