import vine from '@vinejs/vine'

const getBooksQueryValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(100).optional(),
    sort: vine.string().in(['name', 'firstname', 'created_at']).optional(),
    order: vine.string().in(['asc', 'desc']).optional(),
    categoryId: vine.number().optional(),
    authorId: vine.number().optional(),
    userId: vine
      .number()
      .exists(async (db, value) => {
        const user = await db.from('users').where('id', value).first()
        return !!user
      })
      .optional(),
    search: vine.string().trim().minLength(1).optional(),
  })
)

export { getBooksQueryValidator }
