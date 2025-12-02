import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const createRiwayatAbsenValidator = vine.compile(
	vine.object({
		pegawai_id: vine.number().exists({
			table: 'user_pegawais',
			column: 'id'
    	}),

		date: vine.string().regex(dateRegex)
	})
)

export const updateRiwayatAbsenValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		// judul: vine.string().trim().minLength(1).maxLength(255).optional(),
  	})
)
