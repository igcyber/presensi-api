import BaseInterface from '#IInterfaces/core/BaseInterface'
import HariLiburModel from '#models/HariLiburModel'

export default interface HariLiburInterface extends BaseInterface<HariLiburModel> {
	// Ini HariLiburInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<HariLibur | null>
	indexData(search: string, date: string, page: number, per_page: number): Promise<HariLiburModel[]>
	createData(data: Partial<any>): Promise<HariLiburModel>
	updateData(id: number, data: Partial<any>): Promise<HariLiburModel>
	destroyData(id: number): Promise<void>
}
