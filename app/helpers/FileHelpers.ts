import drive from '@adonisjs/drive/services/main'
import * as fs from 'fs'
import * as path from 'path'
import app from '@adonisjs/core/services/app'
import env from '#start/env'

export class FileHelper {
	/**
	 * Simpan file di disk DAN atur mode chmod-nya (hanya untuk driver 'local').
	 * 
	 * @param folder string nama folder relatif terhadap disk root (misal 'faceregister')
	 * @param fileName string nama file
	 * @param fileContent string | Uint8Array Isi file (Buffer Node.js adalah Uint8Array)
	 * @param chmodMode fs.Mode Izin file yang diinginkan (default: 755)
	 * @returns Promise<string> Path relatif file yang disimpan
	 */
	 public static async putFile(
		folder: string,
		fileName: string,
		fileContent: string | Uint8Array,
		chmodMode: fs.Mode = 0o755
	): Promise<string> {
		const disk					=	drive.use()
		const filePathRelatif		=	`${folder}/${fileName}`

		if (env.get('DRIVE_DISK') === 'fs') {
			const fullFolderPath	=	path.join(app.makePath('storage'), folder)

			if (!fs.existsSync(fullFolderPath)) {
				fs.mkdirSync(fullFolderPath, { recursive: true })
			}
		}

		await disk.put(filePathRelatif, fileContent)

		if (env.get('DRIVE_DISK') === 'fs') {
			const fullAbsolutePath = path.join(app.makePath('storage'), filePathRelatif)

			try {
				await fs.promises.chmod(fullAbsolutePath, chmodMode)
			} catch (error: any) {
				throw {
					code: 500,
					message: error.message
				}
			}
		}

		return filePathRelatif
	}

	/**
	 * Cek apakah file ada di disk
	 * @param folder string
	 * @param fileName string
	 */
	public static async fileExists(folder: string, fileName: string): Promise<boolean> {
		const disk		=	drive.use()
		const filePath	=	`${folder}/${fileName}`

		return disk.exists(filePath)
	}

	/**
	 * Hapus file dari disk
	 * @param folder string
	 * @param fileName string
	 */
	public static async deleteFile(folder: string, fileName: string): Promise<void> {
		const disk		=	drive.use()
		const filePath	=	`${folder}/${fileName}`

		if (await disk.exists(filePath)) await disk.delete(filePath)
	}
}
