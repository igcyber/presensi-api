import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const createPermohonanValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255),
		// judul: vine.string().trim().minLength(1).maxLength(255),
	})
)

export const updatePermohonanValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		// judul: vine.string().trim().minLength(1).maxLength(255).optional(),
  	})
)

export const verifyPermohonanValidator = vine.compile(
	vine.object({
		status: vine.enum(['pending','diterima','ditolak'] as const),
		keterangan_verifikator: vine.string().trim().minLength(1).maxLength(255).optional()
	})
)
