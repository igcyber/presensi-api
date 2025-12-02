import { Queue } from '#queues/services/QueueService'

export function dispatch(job: any) {
    return {
        delay(seconds: number) {
            job.delay = seconds
            return this
        },
        async dispatch() {
            await Queue.dispatch(job.constructor, job.payload, job.delay)
        }
    }
}

export function dispatchSync(job: any) {
    return job.handle()
}

export function dispatchAfterResponse(job: any) {
    setImmediate(() => job.handle())
}
