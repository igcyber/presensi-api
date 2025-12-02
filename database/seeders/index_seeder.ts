import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IndexSeeder extends BaseSeeder {
    private async seed(SeederImport: Promise<{ default: typeof BaseSeeder }>, name: string) {
        const color = {
            reset: '\x1b[0m',
            yellow: '\x1b[33m',
            green: '\x1b[32m',
            red: '\x1b[31m',
            cyan: '\x1b[36m',
        }

        try {
            console.log(`${color.yellow}⚙️  Proses seeder ${name} sedang berjalan...${color.reset}`)

            const Seeder = await SeederImport
            await new Seeder.default(this.client).run()

            console.log(`${color.green}✅ Berhasil menjalankan seeder: ${name}${color.reset}\n`)
        } catch (error) {
            console.error(`\t ${color.red}❌ Gagal pada seeder: ${name}${color.reset}`)
            console.error(`\t 📂 File: ${name}Seeder`)
            console.error(`\t 💬 Pesan: ${error.message}`)

            if (error.stack)
                console.error(`\t 🧩 Stack: \n\t\t${color.cyan}${error.stack}${color.reset}\n`)
            throw error
        }
    }

    public async run() {
        await this.seed(import('#database/seeders/role_permission_seeder'), 'Role Dan Permission')
        await this.seed(import('#database/seeders/tipe_pegawai_seeder'), 'Tipe Pegawai Seeder')
        await this.seed(import('#database/seeders/kantor_seeder'), 'Kantor Seeder')
        await this.seed(import('#database/seeders/user_seeder'), 'User Seeder')
    }
}
