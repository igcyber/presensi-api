import BaseInterface from '#IInterfaces/core/BaseInterface'
import PegawaiModel from '#models/UserPegawaiModel'

export default interface PegawaiInterface extends BaseInterface<PegawaiModel> {
	// Ini PegawaiInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<Pegawai | null>
	indexData(search: string, tipe: string, page: number, per_page: number): Promise<PegawaiModel[]>
	allData(): Promise<PegawaiModel[]>
	createData(dataUser: Partial<any>, dataPegawai: Partial<any>): Promise<PegawaiModel>
	updateData(id: number, dataUser: Partial<any>, dataPegawai: Partial<any>): Promise<PegawaiModel>
	destroyData(id: number): Promise<void>
}
