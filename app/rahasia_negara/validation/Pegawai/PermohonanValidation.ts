import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider	= messageProvider

const dateFullRegex	= /^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
const dateRegex		= /^\d{4}-\d{2}-\d{2}$/

export const filterPermohonanValidator = vine.compile(
	vine.object({
		pegawai_id: vine.number().exists({
			table: 'user_pegawais',
			column: 'id'
    	}),

		search: vine.string().trim().minLength(1).maxLength(255).optional(),

		status: vine.enum(['Semua Status', 'Pending', 'Diterima', 'Ditolak', 'Batal'] as const),

		tipe: vine.enum(['Semua Tipe', 'Izin', 'Sakit', 'Cuti'] as const),

		date: vine.string().regex(dateFullRegex),
	})
)

export const createPermohonanValidator = vine.compile(
	vine.object({
		pegawai_id: vine.number().exists({
			table: 'user_pegawais',
			column: 'id'
    	}),

		tipe: vine.enum(['Izin', 'Sakit', 'Cuti'] as const),

		tanggal_pengajuan: vine.string().regex(dateRegex),

		keterangan_pengajuan: vine.string().trim().minLength(1).maxLength(255),

		file_pendukung: vine.file({
			extnames: ['pdf']
		})
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
