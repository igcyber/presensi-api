import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const createAbsenValidator = vine.compile(
	vine.object({
		pegawai_id: vine.number().exists({
			table: 'user_pegawais',
			column: 'id'
    	}),
		tipe: vine.enum(['MASUK', 'PULANG'] as const),
		lat: vine.string().regex(/^-?\d+(\.\d+)?$/),
		long: vine.string().regex(/^-?\d+(\.\d+)?$/),
		jarak: vine.number(),
		image: vine.file({
			extnames: ['jpg', 'jpeg', 'png']
		})
	})
)

export const updateAbsenValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		// judul: vine.string().trim().minLength(1).maxLength(255).optional(),
  	})
)
