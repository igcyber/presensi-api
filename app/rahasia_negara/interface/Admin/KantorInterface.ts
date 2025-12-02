import BaseInterface from '#IInterfaces/core/BaseInterface'
import KantorModel from '#models/KantorModel'

export default interface KantorInterface extends BaseInterface<KantorModel> {
	// Ini KantorInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<Kantor | null>
	indexData(search: string, page: number, per_page: number): Promise<KantorModel[]>
	createData(data: Partial<any>): Promise<KantorModel>
	updateData(id: number, data: Partial<any>): Promise<KantorModel>
	destroyData(id: number): Promise<void>
}
