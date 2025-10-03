/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import CommentsController from '#controllers/comments_controller'
import BooksController from '#controllers/books_controller'
import CategoriesController from '#controllers/categories_controller'
import CategoryBooksController from '#controllers/category_books_controller'
import EvaluationsController from '#controllers/evaluations_controller'
import AuthorsController from '#controllers/authors_controller'
import UsersController from '#controllers/users_controller'
import UserBooksController from '#controllers/user_books_controller'

// Show all books
router.get('/books', [BooksController, 'index'])

// Show all categories
router.get('/categories', [CategoriesController, 'index'])

// Show all books in one category
router.get('/categories/:category_id/books', [CategoryBooksController, 'index'])

router.group(() => {
  // CRUD Books
  router
    .group(() => {
      router.get(':book_id', [BooksController, 'show'])
      router.post('', [BooksController, 'store'])
      router.put(':book_id', [BooksController, 'update'])
      router.delete(':book_id', [BooksController, 'destroy'])
    })
    .prefix('books')

  // CRUD comments
  router
    .group(() => {
      router.resource('comments', CommentsController).apiOnly()
    })
    .prefix('books/:book_id')

  // CRUD evaluations
  router
    .group(() => {
      router.resource('evaluations', EvaluationsController).apiOnly()
    })
    .prefix('books/:book_id')

  // CRUD authors
  router.resource('authors', AuthorsController).apiOnly()

  // CRUD categories
  router
    .group(() => {
      router.post('', [CategoriesController, 'store'])
      router.put(':category_id', [CategoriesController, 'update'])
      router.delete(':category_id', [CategoriesController, 'destroy'])
    })
    .prefix('categories')

  // CRUD users
  router.resource('users', UsersController).apiOnly()

  // Show own books
  router
    .group(() => {
      router.resource('books', UserBooksController).apiOnly()
    })
    .prefix('users/:user_id')
})
// .use(middleware.auth())

router.group(() => {
  router.post('login', [AuthController, 'login'])
  router.post('logout', [AuthController, 'logout']).use(middleware.auth())
})
