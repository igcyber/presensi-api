export function ok<T>(data: T, meta: Record<string, unknown> = {}) {
  return {
    status: 'success',
    data,
    meta,
  }
}

export function error(message: string, code = 'BAD_REQUEST', details?: unknown) {
  return {
    status: 'error',
    message,
    code,
    details,
  }
}
