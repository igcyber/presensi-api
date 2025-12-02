import BaseInterface from '#IInterfaces/core/BaseInterface'
import AbsenModel from '#models/AbsenModel'

export default interface RiwayatAbsenInterface extends BaseInterface<AbsenModel> {
	// Ini RiwayatAbsenInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<RiwayatAbsen | null>
	indexData(pegawai: number, data: any): Promise<AbsenModel[]>
}
