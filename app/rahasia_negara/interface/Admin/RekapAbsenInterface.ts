import BaseInterface from '#IInterfaces/core/BaseInterface'
import AbsenModel from '#models/AbsenModel'

export default interface RekapAbsenInterface extends BaseInterface<AbsenModel> {
	// Ini RekapAbsenInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<RekapAbsen | null>
	rekapData(data: Partial<any>): Promise<any>
}
