import vine from '@vinejs/vine'

const bookValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .minLength(2)
      .maxLength(255)
      .unique(async (query, field) => {
        const category = await query.from('books').where('title', field).first()
        return !category
      }),
    categoryId: vine.number().exists(async (db, value) => {
      const category = await db.from('categories').where('id', value).first()
      return !!category
    }),
    authorId: vine.number().exists(async (db, value) => {
      const author = await db.from('authors').where('id', value).first()
      return !!author
    }),
    numberOfPages: vine.number(),
    pdfLink: vine
      .string()
      .minLength(2)
      .maxLength(255)
      .unique(async (query, field) => {
        const category = await query.from('books').where('pdf_link', field).first()
        return !category
      }),
    editor: vine.string().minLength(2).maxLength(255),
    editionYear: vine.number(),
    abstract: vine.string().minLength(2).maxLength(255),
    imagePath: vine.string().minLength(2).maxLength(255).nullable(),
  })
)

export { bookValidator }
