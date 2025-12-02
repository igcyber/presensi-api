import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const createPwaVersionValidator = vine.compile(
	vine.object({
		version: vine.string().trim().unique({
			table: '_pwa_versions',
			column: 'version'
		})
	})
)

export const updatePwaVersionValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		// judul: vine.string().trim().minLength(1).maxLength(255).optional(),
  	})
)
