import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(3).maxLength(32),
    hash_password: vine.string().minLength(8).maxLength(512),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(32)
      .unique(async (query, field) => {
        const user = await query.from('users').where('username', field).first()
        return !user
      }),
    hash_password: vine.string().minLength(8).maxLength(512),
  })
)
