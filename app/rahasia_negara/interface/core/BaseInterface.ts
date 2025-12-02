export default interface BaseInterface<T> {
	index(search: string | null, searchableColumns: string[], page: number, per_page: number): Promise<T[]>
	findById(id: number): Promise<T | null>
	create(data: Partial<T>): Promise<T>
	update(id: number, data: Partial<T>): Promise<T | null>
	destroy(id: number): Promise<void>
}