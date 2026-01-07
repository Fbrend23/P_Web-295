import vine from '@vinejs/vine'

const bookValidator = (bookId?: number) =>
  vine.compile(
    vine.object({
      title: vine
        .string()
        .minLength(2)
        .maxLength(255)
        .unique(async (query, field) => {
          const q = query.from('books').where('title', field)
          if (bookId) {
            q.whereNot('id', bookId)
          }
          const book = await q.first()
          return !book
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
      pdf: vine
        .file({ extnames: ['pdf'], size: '5mb' })
        .optional()
        .nullable(),
      // pdfLink: vine.string().minLength(2).maxLength(255).optional(),
      editor: vine.string().minLength(2).maxLength(255),
      editionYear: vine.number(),
      abstract: vine.string().minLength(2).maxLength(255),
      image: vine
        .file({ extnames: ['jpg', 'png', 'jpeg'], size: '5mb' })
        .optional()
        .nullable(),
      // imagePath: vine.string().nullable().optional(),
      removePDF: vine.boolean().optional(),
      removeImage: vine.boolean().optional(),
    })
  )

export { bookValidator }
