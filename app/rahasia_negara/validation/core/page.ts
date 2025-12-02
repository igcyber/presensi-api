import vine from '@vinejs/vine'

export const createPageValidator = vine.compile(
  vine.object({
    nama: vine.string().trim().minLength(1).maxLength(255),
    pageId: vine.number().min(1).nullable().optional(),
    isi: vine.string().trim().optional(),
  })
)

export const updatePageValidator = vine.compile(
  vine.object({
    nama: vine.string().trim().minLength(1).maxLength(255).optional(),
    pageId: vine.number().min(1).nullable().optional(),
    isi: vine.string().trim().optional(),
  })
)
