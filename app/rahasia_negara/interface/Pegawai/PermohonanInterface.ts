import BaseInterface from '#IInterfaces/core/BaseInterface'
import PermohonanModel from '#models/PermohonanModel'

export default interface PermohonanInterface extends BaseInterface<PermohonanModel> {
	// Ini PermohonanInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<Permohonan | null>
	indexData(data: Partial<any>, page: number, per_page: number): Promise<PermohonanModel[]>
	checkData(data: Partial<any>, withTanggal: Boolean): Promise<PermohonanModel[]>
	createData(data: Partial<any>): Promise<PermohonanModel>
}
