import BaseInterface from '#IInterfaces/core/BaseInterface'
import PwaVersionModel from '#models/PwaVersionModel'

export default interface PwaVersionInterface extends BaseInterface<PwaVersionModel> {
	// Ini PwaVersionInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<PwaVersion | null>
	latest(): Promise<PwaVersionModel | null>
}
