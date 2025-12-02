import { BaseCommand, args } from '@adonisjs/core/ace'
import { fileURLToPath } from 'node:url'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { pascalCase } from 'change-case'
import kleur from 'kleur'

const STUBS_ROOT = fileURLToPath(new URL('../stubs/make', import.meta.url))

export default class CreateSchedule extends BaseCommand {
	public static commandName 	= 'make:schedule'
	public static description 	= 'Generate File Schedule'

	public static help			= [
		'Contoh:',
		kleur.green('  node ace make:schedule Sample'),
		kleur.green('  node ace make:schedule Admin/Sample')
	]

	@args.string()
	declare name: string

	async run() {
		const parts			=	this.name.split('/').filter(Boolean)
		const className 	=	pascalCase(parts.pop() ?? '')

		if (!className) throw new Error('Nama class tidak boleh kosong')

		const namespace 	=	parts.join('/')
		const folder 		=	join('app/schedulers', namespace)

		if (!existsSync(folder)) mkdirSync(folder, { recursive: true })

		const replacements	=	{
			CLASS: className,
			NAMESPACE: namespace ? `${namespace}/` : '',
		}

		const stubPath		=	join(STUBS_ROOT, 'schedule/main.stub')
		let content			=	readFileSync(stubPath, 'utf-8')

		Object.entries(replacements).forEach(([k, v]) => {
			content			=	content.replace(new RegExp(`{{${k}}}`, 'g'), v)
		})

		const filePath		=	join(folder, `${className}Schedule.ts`)
		const msg			=	existsSync(filePath) ? `${filePath} sudah ada. Overwrite?` : `Generate file ${filePath}?`

		if (await this.prompt.confirm(msg)) {
			writeFileSync(filePath, content)

			this.logger.success(`Generated: ${filePath}\n`)
		} else {
			this.logger.info(`Skip: ${filePath}\n`)
		}
	}
}
