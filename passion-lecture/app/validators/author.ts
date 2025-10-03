import vine from '@vinejs/vine'
const authorValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(2).maxLength(255),
    lastName: vine.string().minLength(2).maxLength(255),
  })
)
export { authorValidator }
