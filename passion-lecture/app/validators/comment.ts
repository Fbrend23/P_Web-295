import vine from '@vinejs/vine'

const commentValidator = vine.compile(
  vine.object({
    content: vine.string().maxLength(200),
    userId: vine.number(),
  })
)

export { commentValidator }
