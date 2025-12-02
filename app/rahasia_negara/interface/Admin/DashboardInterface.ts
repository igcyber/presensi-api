import BaseInterface from '#IInterfaces/core/BaseInterface'
import AbsenModel from '#models/AbsenModel'

export default interface DashboardInterface extends BaseInterface<AbsenModel> {
	// Ini DashboardInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<Dashboard | null>
	summary(data: any): Promise<any>
}
