import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(100)
      .unique(async (db, value) => {
        const role = await db.from('roles').where('name', value).first()
        return !role
      }),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
  })
)
