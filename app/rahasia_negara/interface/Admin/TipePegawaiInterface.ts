import BaseInterface from '#IInterfaces/core/BaseInterface'
import TipePegawaiModel from '#models/TipePegawaiModel'

export default interface TipePegawaiInterface extends BaseInterface<TipePegawaiModel> {
	// Ini TipePegawaiInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<TipePegawai | null>
	allData(): Promise<TipePegawaiModel[]>
}
