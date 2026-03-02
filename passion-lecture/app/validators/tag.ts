import vine from '@vinejs/vine'
const tagValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(2)
      .maxLength(255)
      .unique(async (query, field) => {
        const category = await query.from('categories').where('label', field).first()
        return !category
      }),
  })
)
export { tagValidator }
