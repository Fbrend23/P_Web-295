import vine from '@vinejs/vine'
const categoryValidator = vine.compile(
  vine.object({
    label: vine.string().minLength(2).maxLength(255),
  })
)
export { categoryValidator }
