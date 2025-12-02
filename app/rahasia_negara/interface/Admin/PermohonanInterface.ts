import BaseInterface from '#IInterfaces/core/BaseInterface'
import PermohonanModel from '#models/PermohonanModel'

export default interface PermohonanInterface extends BaseInterface<PermohonanModel> {
	// Ini PermohonanInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<Permohonan | null>
	indexData(search: string, tipe: string, status: string, date: string, page: number, per_page: number): Promise<PermohonanModel[]>
	verify(id: number, data: Partial<any>): Promise<PermohonanModel>
}
