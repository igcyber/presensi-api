import type { HttpContext } from '@adonisjs/core/http'

/**
 * Interface untuk struktur response API standar
 */
export interface ApiResponse<T> {
	success: boolean
	message: string
	data?: T
	errors?: any
	timestamp: string
}

/**
 * Fungsi dasar untuk mengirim response.
 * @param ctx HttpContext dari AdonisJS
 * @param statusCode Kode status HTTP
 * @param success Status keberhasilan
 * @param message Pesan response
 * @param payload Data atau error yang akan dikirim
 */
function sendResponse<T = any>(
	response: HttpContext['response'],
	statusCode: number,
	success: boolean,
	message: string,
	payload?: T
) {
	const responseData: ApiResponse<any> & { code: number } = {
		success,
		code: statusCode,
		message,
		timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
	}

	if (payload) {
		if (success) responseData.data = payload
		else responseData.errors = payload
	}

	return response.status(statusCode).json(responseData)
}

export const success = <T>(response: HttpContext['response'], message: string, data?: T) => {
	return sendResponse(response, 200, true, message, data)
}

export const created = <T>(response: HttpContext['response'], message: string, data?: T) => {
	return sendResponse(response, 201, true, message, data)
}

export const error = (response: HttpContext['response'], statusCode: number, message: string, errors?: any) => {
	return sendResponse(response, statusCode, false, message, errors)
}

export const badRequest = (response: HttpContext['response'], message: string = 'Bad Request', errors?: any) => {
	return sendResponse(response, 400, false, message, errors)
}

export const unauthorized = (response: HttpContext['response'], message: string = 'Unauthorized Access') => {
	return sendResponse(response, 401, false, message)
}

export const forbidden = (response: HttpContext['response'], message: string = 'Forbidden') => {
	return sendResponse(response, 403, false, message)
}

export const notFound = (response: HttpContext['response'], message: string = 'Resource Not Found') => {
	return sendResponse(response, 404, false, message)
}

export const serverError = (response: HttpContext['response'], message: string = 'Internal Server Error') => {
	return sendResponse(response, 500, false, message)
}
