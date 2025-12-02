export type Exact<A, B extends A> = A & {
    [K in Exclude<keyof B, keyof A>]: never
}