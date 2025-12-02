import { Queue } from '#queues/services/QueueService'

export class Bus {
    static batch(jobs: any[]) {
        return {
            async dispatch() {
                for (const job of jobs) {
                    await Queue.dispatch(job.constructor, job.payload, job.delay)
                }
            }
        }
    }
}
