export function dateToMillisLocal (dateString: string) {
    let checkDateSplit      =   dateString.split('-')

    if ( checkDateSplit[2] && checkDateSplit[2].length ) {
        checkDateSplit[2]   =   checkDateSplit[2].split(' ')[0]
    }

    const [year, month, day] = checkDateSplit.map(Number)

    return new Date(year, month - 1, day, 0, 0, 0, 0).getTime()
}

export function isWeekend(tanggal: string | any = null) {
    if ( tanggal === undefined || tanggal === null ) tanggal = new Date().toLocaleString('sv-SE')

    const d = new Date(tanggal).getDay()
    return d === 0 || d === 6
}

export function selisihHari(getData: any) {
    const selisihHari   =   Math.abs(
        dateToMillisLocal(String(getData.data.awal.split(' ')[0]))
        -
        dateToMillisLocal(String(getData.data.akhir.split(' ')[0]))
    )

    const jumlahHari    =   selisihHari / (1000 * 60 * 60 * 24)

    return jumlahHari
}

export function getTanggalFormatTimeStamp(tanggal: string | any = null, tipe: boolean = true) {
    if ( tanggal === undefined || tanggal === null ) tanggal = new Date()

    const konversiTanggal   =   new Date(tanggal)
    const sekarang          =   new Date()

    konversiTanggal.setHours(
        tipe ? sekarang.getHours() : 0,
        tipe ? sekarang.getMinutes() : 0,
        tipe ? sekarang.getSeconds() : 0,
        tipe ? sekarang.getMilliseconds() : 0,
    )

    return new Date(konversiTanggal).toLocaleString('sv-SE')
}

export function getTanggal(tanggal: string | any = null) {
    if ( tanggal === undefined || tanggal === null ) tanggal = new Date()

    let awal    =   new Date(tanggal)
    let akhir   =   new Date(tanggal)

    return {
        awal: awal.toLocaleDateString('sv-SE') + " 00:00:00",
        akhir: akhir.toLocaleDateString('sv-SE') + " 23:59:59"
    }
}

export function getDays(type: string = 'daily') {
    const sekarang                  =   new Date()
    let awal: any, akhir: any       =   null

    if (type == 'monthly') {
        awal    = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1)
        akhir   = new Date(sekarang.getFullYear(), sekarang.getMonth() + 1, 0)

        awal    = awal.toLocaleDateString('sv-SE') + " 00:00:00"
        akhir   = akhir.toLocaleDateString('sv-SE') + " 23:59:59"
    } else {
        if (type == 'weekly') {
            akhir           =   sekarang.toLocaleDateString('sv-SE') + " 23:59:59"
            const tanggal   =   sekarang.setDate(sekarang.getDate() - 7)
            awal            =   new Date(tanggal).toLocaleDateString('sv-SE') + " 00:00:00"
        } else {
            awal    = sekarang.toLocaleDateString('sv-SE') + " 00:00:00"
            akhir   = sekarang.toLocaleDateString('sv-SE') + " 23:59:59"
        }
    }

    return {
        awal,
        akhir
    }
}