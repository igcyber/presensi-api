import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const createDashboardValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255),
		// judul: vine.string().trim().minLength(1).maxLength(255),
	})
)

export const updateDashboardValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		// judul: vine.string().trim().minLength(1).maxLength(255).optional(),
  	})
)
