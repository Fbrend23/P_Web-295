import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {

   /**
   * Créer un token OAT après validation des données utilisateurs
   */
  async login({ request, response }: HttpContext) {
    // Validation du nom d'utilisateur et mot de passe
    const { username, hash_password } = await request.validateUsing(loginValidator)
    // Vérification qu'un utilisateur existe avec ce nom d'utilisateur et ce mot de passe
    const user = await User.verifyCredentials(username, hash_password)
    // Génération d'un token OAT
    const token = await User.accessTokens.create(user)
    // Retourne le token et les infos utilisateurs
    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

  /**
   * Enregistre un utilisateur
   */
  async register({ request, response }: HttpContext) {
    // Validation des données utilisateurs
    const payload = await request.validateUsing(registerValidator)
    // Création de l'utilisateur
    const user = await User.create(payload)
    // Retourne les données utilisateurs
    return response.created(user)
  }

  /**
   * Supprime le token OAT de l'utilisateur connecté
   */
  async logout({ auth, response }: HttpContext) {
    // Récupère l'utilisateur connecté/authentifié
    const user = auth.getUserOrFail()
    // Récupère le token de l'utilisateur connecté
    const token = auth.user?.currentAccessToken.identifier
    // Si le token n'existe pas, retourne une erreur HTTP 400
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    // Supprime le token
    await User.accessTokens.delete(user, token)
    // Confirme à l'utilisateur que le logout est un succès
    return response.ok({ message: 'Logged out' })
  }

}
