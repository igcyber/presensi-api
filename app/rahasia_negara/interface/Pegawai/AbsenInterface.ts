import BaseInterface from '#IInterfaces/core/BaseInterface'
import AbsenModel from '#models/AbsenModel'
import FaceDescriptorModel from '#models/FaceDescriptorModel'
import KantorModel from '#models/KantorModel'
import PermohonanModel from '#models/PermohonanModel'

export default interface AbsenInterface extends BaseInterface<AbsenModel> {
	// Ini AbsenInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<Absen | null>
	indexData(data: any): Promise<AbsenModel[]>
	checkFaceId(pegawai: number): Promise<FaceDescriptorModel>
	createData(dataAbsen: any, dataPermohonan: any): Promise<AbsenModel>
	getKantor(kantorId: number): Promise<KantorModel | null>
	getPermohonan(pegawai: number): Promise<PermohonanModel[]>
}
