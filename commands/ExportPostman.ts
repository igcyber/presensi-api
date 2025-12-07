import { addItemToCollection, extractQueryParamsFromHandler, extractRequestBodyFromHandler, getFirstNSegments } from '#helpers/ForPostmanGenerate'

import { BaseCommand } from '@adonisjs/core/ace'
import router from '@adonisjs/core/services/router'
import fs from 'node:fs'
import path from 'node:path'

export default class ExportPostman extends BaseCommand {
	static commandName = 'postman:export'
	static description = 'Generate Postman collection grouped by first 3 path segments (filtered)'

	public async run() {
		try {
			await this.app.init()
			await this.app.boot()
			await this.app.start(() => {})

			const httpServer	=	await this.app.container.make('server')
			await httpServer.boot()

			const store			=	router.toJSON()
			const allRoutes		=	store.root

			if (!Array.isArray(allRoutes)) {
				this.logger.error('Routes tidak ditemukan!')

				return
			}

			const allowedPrefixes		=	[
				'/api/pwa-latest-version',
				'/api/auth',
				'/api/setting',
				'/api/admin',
				'/api/pegawai'
			]

			const postmanItems: any[]	= []

			for (const route of allRoutes) {
				if (!route.pattern.startsWith('/api/')) continue
				if (!allowedPrefixes.some(prefix => route.pattern.startsWith(prefix))) continue

				const method		=	route.methods[0]
				const pattern		=	route.pattern

				let header			=	[
					{ key: 'Accept', value: 'application/json' },
					{ key: 'Content-Type', value: 'application/json' }
				]

				if ( !['/api/auth/login', '/api/auth/refresh-token', '/api/auth/logout', '/api/pwa-latest-version'].includes(pattern) ) {
					header.push({ key: 'Authorization', value: 'Bearer {{TOKEN}}' },)
				}

				const item: any		=	{
					name: route.name || pattern,
					request: {
						method,
						header: header,
							url: {
							raw: `{{base_url}}${pattern}`,
							host: ['{{base_url}}'],
							path: pattern.replace(/^\//, '').split('/')
						}
					}
				}

				if (method === 'GET') {
					let query		=	extractQueryParamsFromHandler(route)
					item.parameter	=	query ? query : {}
				}

				const body	=	extractRequestBodyFromHandler(route)
				if (body) {
					item.request.body = {
						mode: 'raw',
						raw: JSON.stringify(body, null, 2)
					}
				}

				const folderSegments	=	getFirstNSegments(pattern)

				addItemToCollection(postmanItems, folderSegments, item)
			}

			const finalCollection = {
				info: {
					name: 'API Presensi',
					schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
				},
				item: postmanItems
			}

			const outPath	=	path.join(process.cwd(), 'routes/postman/postman_collection.json')

			fs.mkdirSync(path.dirname(outPath), { recursive: true })
			fs.writeFileSync(outPath, JSON.stringify(finalCollection, null, 2))

			this.logger.success('Berhasil Membuat File Postman Collection')
			this.logger.info(outPath)
		} catch (err: any) { this.logger.error(err.stack || err.message) }
	}
}
