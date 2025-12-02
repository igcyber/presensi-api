import '@adonisjs/lucid/types/model'

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    withTrashed(): this
    onlyTrashed(): this
    forceDelete(): Promise<number>
    restore(): Promise<number>
  }
}
