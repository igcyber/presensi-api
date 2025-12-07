/* =======================
 * Body extractor per route
 * ======================= */
export function extractRequestBodyFromHandler(route: any): Record<string, any> | null {
	const method = route.methods[0]

	if (!['POST', 'PUT', 'PATCH'].includes(method)) return null

	const handler = route.pattern || ''

	switch (handler) {
        case '/api/auth/login':
			return {
                username: 'string | Required => prama123',
                password: 'string | Required => KingPramaNomor1'
            }

        case '/api/auth/refresh-token':
			return {
                refresh_token: '{{REFRESH_TOKEN}}'
            }

        case '/api/auth/logout':
			return {
                refresh_token: '{{REFRESH_TOKEN}}'
            }

        case '/api/admin/kantor':
			return {
                nama: "string | Required => Sample",
                alamat: "string | Optional => Jl. Sample No. X RT. 01 RW. 00",
                lat: "string | Required => -0.4191422207962125",
                long: "string | Required => 117.16900524248992",
                deskripsi: "string | Optional => Kantor",
                radius_limit: "number | Required => 100",
                jam_masuk: "string | Required => 07:30:00",
                jam_pulang: "string | Required => 16:30:00"
            }

        case '/api/admin/kantor/:id':
			return {
                nama: "string | Optional => Sample",
                alamat: "string | Optional => Jl. Sample No. X RT. 01 RW. 00",
                lat: "string | Optional => -0.4191422207962125",
                long: "string | Optional => 117.16900524248992",
                deskripsi: "string | Optional => Kantor",
                radius_limit: "number | Optional => 100",
                jam_masuk: "string | Optional => 07:30:00",
                jam_pulang: "string | Optional => 16:30:00"
            }

        case '/api/admin/tipe-pegawai':
			return {
                nama: "string | Required => TA"
            }
        
        case '/api/admin/tipe-pegawai/:id':
			return {
                nama: "string | Optional => TA"
            }

        case '/api/admin/pegawai':
			return {
                tipe_pegawai_id: "number | Required => 1",
                kantor_id: "number | Required => 1",
                nama: "string | Required => Prama Raja Bajak Laut",
                check_radius: "enum | Required => YA | TIDAK",
                lat: "string | Required => -0.4191422207962125",
                long: "string | Required => 117.16900524248992",
                no_hp: "string | Required => 085225800852",
                email: "email | Required => prama@prama.com",
                username: "string | Required => prama",
                password: "string | Required => KingPramaNomor1"
            }

        case '/api/admin/pegawai/:id':
			return {
                tipe_pegawai_id: "number | Required => 1",
                kantor_id: "number | Required => 1",
                nama: "string | Required => Prama Raja Bajak Laut",
                check_radius: "enum | Required => YA | TIDAK",
                lat: "string | Required => -0.4191422207962125",
                long: "string | Required => 117.16900524248992",
                no_hp: "string | Required => 085225800852",
                email: "email | Required => prama@prama.com",
                username: "string | Required => prama"
            }

        case '/api/admin/permohonan/:id/verify':
			return {
                status: "enum | Required => pending | diterima | ditolak",
		        keterangan_verifikator: "string | Optional => Permohanan Diterima"
            }

        case '/api/admin/hari-libur':
			return {
                tanggal: "string | Required => 2025-12-01",
                keterangan: "string | Optional => Libur Nasional"
            }

        case '/api/admin/hari-libur/:id':
			return {
                tanggal: "string | Optional => 2025-12-01",
                keterangan: "string | Optional => Libur Kantor"
            }

        case '/api/admin/pwa-version':
			return {
                version: "string | Required | Unique => V1.0.0.1"
            }

        case '/api/setting/profile/update-profile':
			return {
                nama: "string | Required => Prama Raja Bajak Laut",
                no_hp: "string | Required => 085225800852",
                email: "email | Required => prama@prama.com",
                username: "string | Required => prama"
            }

        case '/api/setting/profile/update-password':
			return {
                old_password: "string | Required | Min : 6 => KingPramaNomor1",
                password: "string | Required | Min : 6 => 1223456",
                password_confirmation: "string | Required | Min : 6 => 1223456"
            }

        case '/api/setting/profile/face-id':
			return {
                image: "file | extensi jpg, jpeg, dan png => FILE"
            }

        case '/api/pegawai/absen':
			return {
                tipe: "enum | Required => MASUK | PULANG",
                lat: "string | Required => -0.4191422207962125",
                long: "string | Required => 117.16900524248992",
                jarak: "10",
                image: "file | extensi jpg, jpeg, dan png => FILE"
            }

        case '/api/pegawai/pengajuan-tidak-hadir':
			return {
                tipe: "enum | Required => Izin | Sakit | Cuti",
                tanggal_pengajuan: "string | Required => 2025-12-01",
                keterangan_pengajuan: "string | Required => Izin Sakit Tidak Bisa Masuk",
                file_pendukung: "file | extensi pdf => FILE"
            }

		default:
			return { sample: `Body untuk ${handler}` }
	}
}

/* =======================
 * Query extractor per route
 * ======================= */
export function extractQueryParamsFromHandler(route: any): Record<string, any> | null {
	const method = route.methods[0]

	if (method !== 'GET') return null

	const handler = route.pattern || ''

	switch (handler) {
        case '/api/admin/dashboard/summary':
			return {
                type: "string | daily, weekly, monthly | default : daily => daily"
            }

        case '/api/admin/dashboard/chart':
			return {
                type: "string | daily, weekly, monthly | default : daily => daily"
            }

        case '/api/admin/dashboard/daily':
			return null

        case '/api/admin/kantor':
			return {
                search: "string | null | Untuk Mencari nama, alamat, atau deskripsi => Kutai Kartanegara",
                page: "number | default = 1 => 2",
                per_page: "number | default = 10, ini untuk limit yang ditampilkan => 20"
            }

        case '/api/admin/kantor/:id':
			return null

        case '/api/admin/tipe-pegawai':
			return {
                search: "string | null | Untuk Mencari nama tipe pegawai => TA",
                page: "number | default = 1 => 2",
                per_page: "number | default = 10, ini untuk limit yang ditampilkan => 20"
            }

        case '/api/admin/tipe-pegawai/list-tipe-pegawai':
			return null

        case '/api/admin/tipe-pegawai/:id':
			return null

        case '/api/admin/pegawai':
			return {
                search: "string | null | Untuk Mencari nama check_radius email username no_hp => test cari apa aja",
                type: "string | Sesuai Text Tipe Pegawai => TA, THL, PKL Dll",
                page: "number | default = 1 => 2",
                per_page: "number | default = 10, ini untuk limit yang ditampilkan => 20"
            }

        case '/api/admin/pegawai/list-pegawai':
			return {
                search: "string | null | Untuk Mencari nama pegawai atau kantor => prama | diskom"
            }

        case '/api/admin/pegawai/:id':
			return null

        case '/api/admin/permohonan':
			return {
                search: "string | null | Untuk Mencari keterangan_pengajuan, keterangan_verifikator, dan username verifikator => test cari apa aja",
                status: "string | Semua Status, Pending, Diterima, Ditolak, Batal | default Semua Status => Pending",
                tipe: "string | Semua Tipe, Izin, Sakit, Cuti | default Semua Tipe => Izin",
                date: "string | default Hari Ini => 2025-11-01",
                page: "number | default = 1 => 2",
                per_page: "number | default = 10, ini untuk limit yang ditampilkan => 20"
            }

        case '/api/admin/permohonan/:id':
			return null

        case '/api/admin/hari-libur':
			return {
                search: "string | null | Untuk Mencari keterangan => lorem ipsum dolor sit amet",
                date: "string | null | Jika null akan memunculkan hari libur selama 1 tahun ditahun sekarang => 2025-11-01",
                page: "number | default = 1 => 2",
                per_page: "number | default = 10, ini untuk limit yang ditampilkan => 20"
            }

        case '/api/admin/hari-libur/:id':
			return null

        case '/api/admin/rekap-absen':
			return {
                pegawai_id: "number | Required => 1",
                tipe: "string => bulanan | range",
                month: "number | Required Jika Tipe == bulanan => 12",
                year: "number | Required Jika Tipe == bulanan => 2025",
                start_date: "string | Required Jika Tipe == range => 2025-11-01",
                end_date: "string | Required Jika Tipe == range | Tidak Boleh Kurang Dari Tanggak start_date => 2025-11-30"
            }

        case '/api/admin/pwa-version':
			return {
                search: "string | null | Untuk Mencari versi dan key => v1.0.0.1",
                page: "number | default = 1 => 2",
                per_page: "number | default = 10, ini untuk limit yang ditampilkan => 20"
            }

        case '/api/admin/pwa-version/latest':
			return null

        case '/api/setting/profile':
			return null

        case '/api/setting/profile/check-face-id':
			return null

        case '/api/pegawai/absen':
			return null

        case '/api/pegawai/rekap-absen':
			return {
                tipe: "string => bulanan | range",
                month: "number | Required Jika Tipe == bulanan => 12",
                year: "number | Required Jika Tipe == bulanan => 2025",
                start_date: "string | Required Jika Tipe == range => 2025-11-01",
                end_date: "string | Required Jika Tipe == range | Tidak Boleh Kurang Dari Tanggak start_date => 2025-11-30"
            }

        case '/api/pegawai/riwayat-absen':
			return {
                date: "string | Default Hari Ini Jika Kosong => 2025-11-01"
            }

        case '/api/pegawai/pengajuan-tidak-hadir':
			return {
                search: "string | null | Untuk Mencari keterangan_pengajuan, keterangan_verifikator, dan username verifikator => test cari apa aja",
                status: "string | Semua Status, Pending, Diterima, Ditolak, Batal | default Semua Status => Pending",
                tipe: "string | Semua Tipe, Izin, Sakit, Cuti | default Semua Tipe => Izin",
                date: "string | default Hari Ini => 2025-11-01"
            }

        case '/api/pegawai/pengajuan-tidak-hadir/status-permohonan':
			return null

		default:
			return null
	}
}

/* =======================
 * Slice Routenya
 * ======================= */
export function getFirstNSegments(pattern: string): string[] {
	const cleaned		=	pattern.replace(/^\/api\//, '')
	const segments	=	cleaned.split('/')

	if (segments.length > 2) return segments.slice(0, 2)

	return segments
}

/* =======================
 * Tambahkan item ke nested folder
 * ======================= */
export function addItemToCollection(collectionItems: any[], segments: string[], itemDetails: any) {
	if (!segments || segments.length === 0) {
		collectionItems.push(itemDetails)

		return
	}

	let current	=	collectionItems

	for (let i = 0; i < segments.length; i++) {
		const seg	=	segments[i]
		let folder	=	current.find((f: any) => f.name === seg)

		if (!folder) {
			folder = { name: seg, item: [] }
			current.push(folder)
		}

		if (i === segments.length - 1) folder.item.push(itemDetails)
		else current = folder.item
	}
}

export function renderDocs(collection: any) {
    const windowData = `
        <script>
            window.postmanCollection = ${JSON.stringify(collection, null, 2)};
        </script>
    `;

    function renderSidebarItems(items: any[], parentIndex = ''): string {
        return items.map((item, idx) => {
            const index = parentIndex === '' ? `${idx}` : `${parentIndex}_${idx}`;

            if (item.item && Array.isArray(item.item) && item.item.length > 0) {
                return `
                    <div class="folder">
                        <div class="folder-title" onclick="toggleFolder(this)">
                            <span class="toggle-icon">▼</span> ${item.name}
                        </div>
                        <div class="folder-children">
                            ${renderSidebarItems(item.item, index)}
                        </div>
                    </div>
                `;
            }

            if (item.request) {
                return `
                    <div class="route-item" id="route-${index}" onclick="showRoute('${index}')">
                        <span class="method ${item.request.method}">${item.request.method}</span>
                        <span class="route-title">${item.name}</span>
                    </div>
                `;
            }

            return '';
        }).join('');
    }

    return `
        <html>
            <head>
                <title>${collection.info.name}</title>

                <link href="https://fonts.googleapis.com/css?family=Roboto:400,500|Roboto+Mono:400,500" rel="stylesheet">

                <style>
                    body { margin: 0; font-family: 'Roboto', sans-serif; display: flex; height: 100vh; background-color: #fafafa; color: #333; }
                    pre { background: #fff; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: 'Roboto Mono', monospace; font-size: 14px; border: 1px solid #ddd; }
                    h1,h2,h3,h4 { margin-top: 0; }
                    .sidebar { width: 320px; background: #fff; padding: 20px; overflow-y: auto; border-right: 1px solid #eee; }
                    .content { flex: 1; padding: 40px; overflow-y: auto; }
                    .content-inner { max-width: 1000px; margin: 0 auto; }
                    .route-item { margin-bottom: 5px; padding: 10px; cursor: pointer; border-radius: 6px; transition: background-color 0.2s; font-size: 14px; }
                    .route-item:hover { background: #f1f1f1; }
                    .route-item.active { background: #e0e0e0; font-weight: bold; }
                    .folder-title { font-weight: bold; margin-bottom: 5px; margin-top: 15px; padding: 8px; background: #f8f8f8; border-radius: 4px; cursor: pointer; font-size: 15px; }
                    .folder-children { margin-left: 10px; padding-left: 10px; border-left: 1px dashed #ddd; }
                    .folder-children.hidden { display: none; }
                    .toggle-icon { margin-right: 8px; transition: transform 0.2s; display: inline-block; }
                    .folder.collapsed .toggle-icon { transform: rotate(-90deg); }
                    .method { padding: 3px 8px; border-radius: 4px; font-size: 11px; color: white; display: inline-block; margin-right: 10px; font-weight: bold; text-transform: uppercase; }
                    .GET { background: #0b7dda; }
                    .POST { background: #28a745; }
                    .PUT, .PATCH { background: #f0ad4e; }
                    .DELETE { background: #d9534f; }
                    .detail-section h3 { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px; color: #555; }
                    .url-display { background: #e9ecef; padding: 10px; border-radius: 5px; font-family: 'Roboto Mono', monospace; }
                </style>

                ${windowData}

                <script>
                    let activeRouteElement = null;

                    function showRoute(index) {
                        if (activeRouteElement) activeRouteElement.classList.remove('active')

                        const currentElement    =   document.getElementById('route-' + index)

                        if (currentElement) {
                            currentElement.classList.add('active')
                            activeRouteElement  =   currentElement
                        }

                        const parts             =   index.split('_').map(x => Number(x))
                        let r                   =   window.postmanCollection.item

                        for (let i = 0; i < parts.length; i++) r = i === parts.length - 1 ? r[parts[i]] : r[parts[i]].item

                        if (!r || !r.request) return

                        const bodyRaw           =   r.request.body && r.request.body.raw ? r.request.body.raw : 'No Body Data'
                        let queryHtml           =   ''

                        if (r.parameter && Object.keys(r.parameter).length > 0) {
                            queryHtml           =   '<div class="detail-section"><h3>Query Params:</h3><pre>' + JSON.stringify(r.parameter, null, 2) + '</pre></div>'
                        }

                        const urlDetails        =   '<pre class="url-display">' + r.request.url.raw + '</pre>'

                        document.getElementById('content-inner').innerHTML = \`
                            <h1>\${r.name}</h1>

                            <p><span class="method \${r.request.method}">\${r.request.method}</span></p>

                            <div class="detail-section">
                                <h3>URL Endpoint</h3>

                                \${urlDetails}
                            </div>

                            <div class="detail-section">
                                <h3>Headers</h3>

                                <pre>\${JSON.stringify(r.request.header, null, 2)}</pre>
                            </div>

                            \${queryHtml}

                            <div class="detail-section">
                                <h3>Body (\${r.request.body ? r.request.body.mode : 'none'})</h3>

                                <pre>\${bodyRaw}</pre>
                            </div>
                        \`;
                    }

                    function toggleFolder(element) {
                        const folder        =   element.parentElement
                        folder.classList.toggle('collapsed')
                        const children      =   element.nextElementSibling

                        if (children.style.display === "none" || children.style.display === "") {
                            children.style.display  =   "block"
                            element.querySelector('.toggle-icon').textContent = '▼'
                        } else {
                            children.style.display  =   "none"
                            element.querySelector('.toggle-icon').textContent = '▶'
                        }
                    }

                    document.addEventListener('DOMContentLoaded', () => {
                        document.querySelectorAll('.folder').forEach(f => f.classList.add('collapsed'))
                        document.querySelectorAll('.folder-children').forEach(c => c.style.display = 'none')
                        document.querySelectorAll('.toggle-icon').forEach(icon => icon.textContent = '▶')
                    })
                </script>
            </head>

            <body>
                <div class="sidebar">
                    <h2>${collection.info.name}</h2>

                    ${renderSidebarItems(collection.item)}
                </div>

                <div class="content">
                    <div id="content-inner">
                        <h2>Selamat Datang di Dokumentasi API</h2>

                        <p>Pilih salah satu endpoint di sidebar untuk melihat detail permintaan.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
}
