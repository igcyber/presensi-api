import { SimpleMessagesProvider } from '@vinejs/vine'

const messages: Record<string, string> = {
	'required': 'Kolom {{ field }} wajib diisi',
	'string': 'Kolom {{ field }} harus berupa teks',
	'number': 'Kolom {{ field }} harus berupa angka',
	'boolean': 'Kolom {{ field }} harus berupa true atau false',
	'array': 'Kolom {{ field }} harus berupa array',
	'object': 'Kolom {{ field }} harus berupa objek',
	'date': 'Kolom {{ field }} harus berupa tanggal yang valid',
	'enum': 'Kolom {{ field }} tidak sesuai dengan pilihan yang tersedia',
	'accepted': 'Kolom {{ field }} harus diterima',
	'confirmed': 'Konfirmasi {{ field }} tidak cocok',
	'database.unique': 'Kolom {{ field }} sudah terdaftar',

	'string.minLength': 'Kolom {{ field }} minimal memiliki {{ min }} karakter',
	'string.maxLength': 'Kolom {{ field }} maksimal memiliki {{ max }} karakter',
	'string.fixedLength': 'Kolom {{ field }} harus berisi tepat {{ size }} karakter',
	'string.alpha': 'Kolom {{ field }} hanya boleh berisi huruf',
	'string.alphaNum': 'Kolom {{ field }} hanya boleh berisi huruf dan angka',
	'string.regex': 'Kolom {{ field }} tidak sesuai dengan format yang benar',
	'string.email': 'Kolom {{ field }} harus berupa alamat email yang valid',
	'string.url': 'Kolom {{ field }} harus berupa URL yang valid',
	'string.uuid': 'Kolom {{ field }} harus berupa UUID yang valid',
	'string.ip': 'Kolom {{ field }} harus berupa alamat IP yang valid',

	'number.min': 'Kolom {{ field }} minimal bernilai {{ min }}',
	'number.max': 'Kolom {{ field }} maksimal bernilai {{ max }}',
	'number.range': 'Kolom {{ field }} harus berada di antara {{ min }} dan {{ max }}',
	'number.positive': 'Kolom {{ field }} harus bernilai positif',
	'number.negative': 'Kolom {{ field }} harus bernilai negatif',
	'number.integer': 'Kolom {{ field }} harus berupa bilangan bulat',

	'array.minLength': 'Kolom {{ field }} minimal memiliki {{ min }} item',
	'array.maxLength': 'Kolom {{ field }} maksimal memiliki {{ max }} item',
	'array.fixedLength': 'Kolom {{ field }} harus berisi tepat {{ size }} item',
	'array.distinct': 'Kolom {{ field }} memiliki item duplikat',

	'object.unknownProperties': 'Kolom {{ field }} memiliki properti yang tidak diizinkan',

	'date.after': 'Kolom {{ field }} harus setelah {{ date }}',
	'date.before': 'Kolom {{ field }} harus sebelum {{ date }}',
	'date.afterOrEqual': 'Kolom {{ field }} harus setelah atau sama dengan {{ date }}',
	'date.beforeOrEqual': 'Kolom {{ field }} harus sebelum atau sama dengan {{ date }}',
	'date.equals': 'Kolom {{ field }} harus sama dengan {{ date }}',

	'not_allowed': "Kolom '{{ key }}' tidak diperbolehkan",
}

export const messageProvider = new SimpleMessagesProvider(messages)
