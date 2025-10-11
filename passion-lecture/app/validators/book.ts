import Author from '#models/author'
import Category from '#models/category'
import vine from '@vinejs/vine'

// const author = await Author.all()
// const authorIds = await author.map((s) => s.id)

// const category = await Category.all()
// const categoryIds = category.map((c) => c.id)

// ------------------------------------------
// TODO trouver un autre moyen de valider les si les id sont existants.
// Sur une installation propre celà lance des requetes sql dans le vide au lancement du serveur node
// Du coup impossible de faire les migrations initiales et d'init le serveur (npm run dev)
// Bisous, Brendan.
// ------------------------------------------

const bookValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(2).maxLength(255),
    categoryId: vine.number() /*.in(categoryIds)*/,
    authorId: vine.number() /*.in(authorIds)*/,
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
