import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

import TipePegawaiModel from '#models/TipePegawaiModel'

export default class TipePegawaiSeeder extends BaseSeeder {
	public async run() {
		const DBTransaction = await db.transaction()

		try {
			// @ts-ignore
			await TipePegawaiModel.updateOrCreateMany('nama', [
				{ nama: 'TA' },
				{ nama: 'THL' },
				{ nama: 'PKL' },
				{ nama: 'MAGANG' },
				{ nama: 'Lainnya' }
			], { client: DBTransaction })

			await DBTransaction.commit()
		} catch (error) {
			await DBTransaction.rollback()

			throw error
		}
	}
}
