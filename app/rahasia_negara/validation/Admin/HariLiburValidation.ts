import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

const dateExists = vine.createRule(async (value: unknown, _, field) => {
	if (typeof value !== 'string') {
		field.report('Tanggal harus berupa string', 'invalidType', field)
		return
	}

	const regex		=	/^\d{4}-\d{2}-\d{2}$/
	if (!regex.test(value.split(' ')[0])) {
		field.report('Format tanggal tidak valid. Gunakan YYYY-MM-DD', 'invalidFormat', field)
		return
	}

	const inputDate	=	value.split(' ')[0]
	const awal		=	`${inputDate} 00:00:00`
	const akhir		=	`${inputDate} 23:59:59`

	const hariLibur	=	field.parent.hari_libur_id as number
	const query		=	db.from('hari_liburs').whereBetween('tanggal', [awal, akhir])

	if (hariLibur) query.whereNot('id', hariLibur)

	const row		=	await query.first()

	if (row) {
		field.report(
			'Tanggal ini sudah ada dalam database dan tidak dapat digunakan.',
			'dateExists',
			field
		)
	}
})

export const createHariLiburValidator = vine.compile(
	vine.object({
		tanggal: vine.string().use(dateExists()),

		keterangan: vine.string().trim().minLength(1).maxLength(255).optional()
	})
)

export const updateHariLiburValidator = vine.compile(
	vine.object({
		hari_libur_id: vine.number().exists({
			table: 'hari_liburs',
			column: 'id'
    	}),
		tanggal: vine.string().use(dateExists()).optional(),
		keterangan: vine.string().trim().minLength(1).maxLength(255).optional()
  	})
)
