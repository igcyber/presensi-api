import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

// @ts-ignore
export const dateRangeRule = vine.createRule( async (value: unknown, _, field) => {
	if (field.parent.tipe !== 'range') return

	if (!field.parent.start_date || !field.parent.end_date) return

	const start		= new Date(field.parent.start_date)
	const end		= new Date(field.parent.end_date)

	if (start > end) {
		field.report(
			'start_date must be less than or equal to end_date',
			'dateRange',
			field
		)
	}
})

export const createRekapAbsenValidator = vine.compile(
	vine.object({
		pegawai_id: vine.number().exists({
			table: 'user_pegawais',
			column: 'id'
    	}),

		tipe: vine.enum(['bulanan', 'range'] as const),

		month: vine.number().min(1).max(12).optional().requiredWhen('tipe', '=', 'bulanan'),

		year: vine.number().min(1900).max(2100).optional().requiredWhen('tipe', '=', 'bulanan'),

		start_date: vine.string().regex(dateRegex).optional().requiredWhen('tipe', '=', 'range'),

    	end_date: vine.string().regex(dateRegex).optional().requiredWhen('tipe', '=', 'range').use(dateRangeRule())
	})
)

export const updateRekapAbsenValidator = vine.compile(
	vine.object({
		// Isi Validasi Disini

		// contoh:
		// nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		// judul: vine.string().trim().minLength(1).maxLength(255).optional(),
  	})
)
