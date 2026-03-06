import User from '#models/user'
import { msalClient } from '#services/msal_service'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    // User name and password validation
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

  async loginMicrosoft({ response }: HttpContext) {
    const authUrl = await msalClient.getAuthCodeUrl({
      scopes: ['user.read'],
      redirectUri: env.get('MSAL_REDIRECT_URI')!,
    })
    return response.redirect(authUrl)
  }

  async callbackMicrosoft({ request, response }: HttpContext) {
    const code = request.input('code')
    const frontendUrl = env.get('FRONTEND_URL')!

    try {
      const authResult = await msalClient.acquireTokenByCode({
        code,
        scopes: ['user.read'],
        redirectUri: env.get('MSAL_REDIRECT_URI')!,
      })

      const microsoftUsername = authResult.account?.username
      if (!microsoftUsername) {
        return response.redirect(`${frontendUrl}/login?error=no_user`)
      }

      // firstOrCreate : cherche par username, sinon crée avec un mot de passe aléatoire
      const user = await User.firstOrCreate(
        { username: microsoftUsername },
        {
          // On génère un hash temporaire pour respecter la contrainte NOT NULL
          hashPassword: Math.random().toString(36).slice(-10),
        }
      )

      const token = await User.accessTokens.create(user)
      const tokenValue = token.value!.release()

      // On release() le token pour l'avoir en texte clair pour le front
      return response.redirect(
        `${frontendUrl}/auth/callback?token=${tokenValue}&username=${user.username}`
      )
    } catch (error) {
      console.error('MSAL Error:', error)
      return response.redirect(`${frontendUrl}/login?error=msal_failed`)
    }
  }
}
