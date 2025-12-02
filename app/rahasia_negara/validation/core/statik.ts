import vine from '@vinejs/vine'

export const createStatikValidator = vine.compile(
  vine.object({
    tipe: vine.enum(['image', 'video', 'dokumen', 'text', 'texteditor']),
    isi: vine.string().trim().minLength(1),
    file: vine
      .file({
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'pdf', 'doc', 'docx'],
      })
      .optional(),
  })
)

export const updateStatikValidator = vine.compile(
  vine.object({
    tipe: vine.enum(['image', 'video', 'dokumen', 'text', 'texteditor']).optional(),
    isi: vine.string().trim().minLength(1).optional(),
    file: vine
      .file({
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'pdf', 'doc', 'docx'],
      })
      .optional(),
  })
)
