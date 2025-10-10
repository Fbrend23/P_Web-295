import Author from '#models/author'
import Category from '#models/category'
import vine from '@vinejs/vine'

const author = await Author.all()
const authorIds = await author.map((s) => s.id)

const category = await Category.all()
const categoryIds = category.map((c) => c.id)

const bookValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(2).maxLength(255),
    categoryId: vine.number().in(categoryIds),
    authorId: vine.number().in(authorIds),
    numberOfPages: vine.number(),
    pdfLink: vine.string().minLength(2).maxLength(255),
    editor: vine.string().minLength(2).maxLength(255),
    editionYear: vine.number(),
    abstract: vine.string().minLength(2).maxLength(255),
    imagePath: vine.string().minLength(2).maxLength(255).nullable(),
    userId: vine.number(),
  })
)
export { bookValidator }
