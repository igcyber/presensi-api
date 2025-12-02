import type { VineValidator } from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import BaseInterface from '#IInterfaces/core/BaseInterface'

export default abstract class BaseService<
    CreateValidator extends VineValidator<any, any>,
    UpdateValidator extends VineValidator<any, any>,
    RepositoryType extends BaseInterface<Data>,
    Data = Infer<CreateValidator>
> {
	constructor(
		protected repository: RepositoryType,
		protected createValidator: CreateValidator,
		protected updateValidator: UpdateValidator
	) {}

	async index(
		search: string | null = null,
		searchableColumns: string[] = [],
		page: number = 1,
		per_page: number = 10
	): Promise<Data[]> {
		return this.repository.index(search, searchableColumns, page, per_page)
	}

	async findById(id: number): Promise<Data | null> {
		return this.repository.findById(id)
	}

	async create(data: any): Promise<Data> {
		const validated = await this.createValidator.validate(data)

		return this.repository.create(validated)
	}

	async update(id: number, data: any): Promise<Data | null> {
		const validated = await this.updateValidator.validate(data)
		return this.repository.update(id, validated)
	}

	async destroy(id: number): Promise<void> {
		return this.repository.destroy(id)
	}
}
