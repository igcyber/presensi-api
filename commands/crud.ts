import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { fileURLToPath } from 'node:url'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { pascalCase } from 'change-case'
import kleur from 'kleur'

const STUBS_ROOT = fileURLToPath(new URL('../stubs/make', import.meta.url))

export default class MakeCrud extends BaseCommand {
	public static commandName = 'make:crud'
	public static description = 'Generate Interface, Repository, Service, Controller, Model, Validation'

	public static help = [
		'Contoh Penggunaan:',
		kleur.green('  node ace make:crud Product'),
  		kleur.green('  node ace make:crud Admin/Product'),
		'',
		'Generate hanya file tertentu (menggunakan flag):',
		`${kleur.green('  node ace make:crud Product -M')}     ${kleur.gray('# Model saja')}`,
		`${kleur.green('  node ace make:crud Product -C')}     ${kleur.gray('# Controller saja')}`,
		`${kleur.green('  node ace make:crud Product -S')}     ${kleur.gray('# Service saja')}`,
		`${kleur.green('  node ace make:crud Product -R')}     ${kleur.gray('# Repository saja')}`,
		`${kleur.green('  node ace make:crud Product -I')}     ${kleur.gray('# Interface saja')}`,
		`${kleur.green('  node ace make:crud Product -V')}     ${kleur.gray('# Validation saja')}`,
		'',
		'Jika tidak memakai flag maka semua file akan dibuat.',
	]

	@args.string({ description: 'Nama Class (contoh: Sample/User atau Admin/Product)' })
	declare name: string

	@flags.boolean({ alias: 'M', description: 'Generate hanya Model' })
	declare modelOnly: boolean

	@flags.boolean({ alias: 'C', description: 'Generate hanya Controller' })
	declare controllerOnly: boolean

	@flags.boolean({ alias: 'S', description: 'Generate hanya Service' })
	declare serviceOnly: boolean

	@flags.boolean({ alias: 'R', description: 'Generate hanya Repository' })
	declare repositoryOnly: boolean

	@flags.boolean({ alias: 'I', description: 'Generate hanya Interface' })
	declare interfaceOnly: boolean

	@flags.boolean({ alias: 'V', description: 'Generate hanya Validation' })
	declare validationOnly: boolean

	public async run() {
		const segments		= this.name.split('/').filter(Boolean)
		const rawName		= segments.pop() ?? ''

		if (!rawName) throw new Error('Nama class tidak boleh kosong')

		const namespace		= segments.join('/')
		const basePascal	= pascalCase(rawName)
		const pascalName	= pascalCase(rawName)

		const folders = {
			model: 'app/models',
			controller: join('app/controllers', namespace),
			validation: join('app/rahasia_negara/validation', namespace),
			service: join('app/rahasia_negara/service', namespace),
			interface: join('app/rahasia_negara/interface', namespace),
			repository: join('app/rahasia_negara/repository', namespace),
		}

		Object.values(folders).forEach((folder) => {
			if (!existsSync(folder)) mkdirSync(folder, { recursive: true })
		})

		const replacements: any = {
			CLASS: basePascal,
			CLASS_CAMEL: pascalName,
			NAMESPACE: namespace ? `${namespace}/` : '',
		}

		const generateFile = async (stubName: string, folder: string, fileName: string) => {
			const stubPath = join(STUBS_ROOT, stubName + '/main.stub')
			let content = readFileSync(stubPath, 'utf-8')

			for (const key in replacements) {
				content = content.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key])
			}

			const targetPath = join(folder, fileName)

			writeFileSync(targetPath, content)
			this.logger.success(`Generated: ${targetPath}\n`)
		}


		const files = {
			model: ['model', folders.model, `${basePascal}Model.ts`],
			controller: ['controller', folders.controller, `${basePascal}Controller.ts`],
			service: ['service', folders.service, `${basePascal}Service.ts`],
			validation: ['validation', folders.validation, `${basePascal}Validation.ts`],
			interface: ['interface', folders.interface, `${basePascal}Interface.ts`],
			repository: ['repository', folders.repository, `${basePascal}Repository.ts`],
		} as const

		const activeFlags = {
			model: this.modelOnly,
			controller: this.controllerOnly,
			service: this.serviceOnly,
			repository: this.repositoryOnly,
			interface: this.interfaceOnly,
			validation: this.validationOnly,
		}

		const hasAnyFlag = Object.values(activeFlags).includes(true)

		if (hasAnyFlag) {
			for (const [key, enabled] of Object.entries(activeFlags)) {
				if (!enabled) continue

				const [stub, folder, filename] = files[key as keyof typeof files]
				const targetPath = join(folder, filename)

				if (existsSync(targetPath)) {
					const overwrite = await this.prompt.confirm(
						`${targetPath} sudah ada. Overwrite file ini?`
					)

					if (!overwrite) {
						this.logger.info(`Skip: ${targetPath}\n`)
						continue
					}
				}

				await generateFile(stub, folder, filename)
			}

			return
		}

		for (const [stub, folder, filename] of Object.values(files)) {
			const targetPath	=	join(folder, filename)

			if (existsSync(targetPath)) {
				const overwrite = await this.prompt.confirm(`${targetPath} sudah ada. Overwrite file ini?`)

				if (!overwrite) {
					this.logger.info(`Skip: ${targetPath}\n`)

					continue
				}
			} else {
				const generate = await this.prompt.confirm(`Generate file ${targetPath}?`)

				if (!generate) {
					this.logger.info(`Skip: ${targetPath}\n`)

					continue
				}
			}

			await generateFile(stub, folder, filename)
		}
	}
}
