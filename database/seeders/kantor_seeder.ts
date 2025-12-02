import db from '@adonisjs/lucid/services/db'

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import KantorModel from '#models/KantorModel'

export default class KantorSeeder extends BaseSeeder {
	public async run() {
		const DBTransaction = await db.transaction()

		try {
			const kantorData = [
				{
					nama: 'Dinas Komunikasi dan Informatika Kabupaten Kutai Kartanegara',
					alamat: 'Jalan Pahlawan No. 1 Bukit Biru, Timbau, Kec. Tenggarong, Kabupaten Kutai Kartanegara, Kalimantan Timur 75511',
					lat: '-0.4569253',
					long: '117.0019486',
					deskripsi: 'Diskominfo Kab. Kukar',
					radius_limit: 20,
					except_user: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
					jam_masuk: '07:30:00',
					jam_pulang: '16:30:00'
				}
			]

			// @ts-ignore
			await KantorModel.updateOrCreateMany('nama', kantorData, { client: DBTransaction })

			await DBTransaction.commit()
		} catch (error) {
			await DBTransaction.rollback()

			throw error
		}
  	}
}
