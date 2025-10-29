import vine from '@vinejs/vine'
const categoryValidator = vine.compile(
  vine.object({
    label: vine
      .string()
      .minLength(2)
      .maxLength(255)
      .unique(async (query, field) => {
        const category = await query.from('categories').where('label', field).first()
        return !category
      }),
  })
)
export { categoryValidator }
