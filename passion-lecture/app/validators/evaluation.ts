import vine from '@vinejs/vine'

const evaluationValidator = vine.compile(
  vine.object({
    note: vine.number().min(0).max(5),
  })
)

export { evaluationValidator }
