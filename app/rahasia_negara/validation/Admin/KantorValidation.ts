import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

const timeRegex		  = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/

export const createKantorValidator = vine.compile(
	vine.object({
		nama: vine.string(),
		alamat: vine.string().optional(),
		lat: vine.string().regex(/^-?\d+(\.\d+)?$/),
		long: vine.string().regex(/^-?\d+(\.\d+)?$/),
		deskripsi: vine.string().optional(),
		radius_limit: vine.number(),
		jam_masuk: vine.string().regex(timeRegex),
		jam_pulang: vine.string().regex(timeRegex),
	})
)

export const updateKantorValidator = vine.compile(
	vine.object({
		nama: vine.string().optional(),
		alamat: vine.string().optional(),
		lat: vine.string().regex(/^-?\d+(\.\d+)?$/).optional(),
		long: vine.string().regex(/^-?\d+(\.\d+)?$/).optional(),
		deskripsi: vine.string().optional(),
		radius_limit: vine.number().optional(),
		jam_masuk: vine.string().regex(timeRegex).optional(),
		jam_pulang: vine.string().regex(timeRegex).optional(),
  	})
)
