import Sample from '#models/sample/sample'

export default class CreateSample {
    static jobPath = 'sample/CreateSample'
    static maxAttempts = 3
    public payload: { nama: string; judul: string }

    constructor(payload: { nama: string; judul: string }) {
        this.payload = payload
    }

    async handle() {
        // @ts-ignore
        await Sample.create({
            nama: this.payload.nama,
            judul: this.payload.judul,
        })

        console.log('Sample added:', this.payload)
    }
}
