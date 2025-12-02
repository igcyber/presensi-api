import BaseInterface from '#IInterfaces/core/BaseInterface'
import UserModel from '#models/core/user'
import FaceDescriptorModel from '#models/FaceDescriptorModel'

export default interface ProfileInterface extends BaseInterface<UserModel> {
	// Ini ProfileInterface Kalau Ada Interface Baru
	// Contoh : findByJudul(judul: string): Promise<Profile | null>
	indexData(id: number): Promise<UserModel | null>
	updateProfile(id: number, dataUser: any, dataPegawai: any): Promise<any | null>
	updatePassword(id: number, data: any): Promise<any | null>
	updateFaceId(data: any): Promise<FaceDescriptorModel>
	checkFaceId(pegawai: number): Promise<FaceDescriptorModel>
}
