import vine from '@vinejs/vine'

const bookValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(2).maxLength(255),
    firstname: vine.string().minLength(2).maxLength(255),
    categoryId: vine.number(),
    authorId: vine.number(),
    numberOfPages: vine.number(),
    pdfLink: vine.string().minLength(2).maxLength(255),
    editor: vine.string().minLength(2).maxLength(255),
    editionYear: vine.number(),
    abstract: vine.string().minLength(2).maxLength(255),
    imagePath: vine.string().minLength(2).maxLength(255),
  })
)
export { bookValidator }
