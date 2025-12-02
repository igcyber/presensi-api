import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Role from '#models/core/role'

export default class RolePermissionSeeder extends BaseSeeder {
	public async run() {
		const DBTransaction = await db.transaction()

		try {
			const roles	=	await Role.updateOrCreateMany( 'slug', [
				{ name: 'Administrator', slug: 'admin' },
				{ name: 'Pegawai', slug: 'pegawai' },
			], { client: DBTransaction })

			const adminRole		= roles.find((r) => r.slug === 'admin')!
			const userRole		= roles.find((r) => r.slug === 'pegawai')!

			adminRole.$trx		= DBTransaction
			userRole.$trx		= DBTransaction

			await DBTransaction.commit()
		} catch (error) {
			await DBTransaction.rollback()

			throw error
		}
	}
}
