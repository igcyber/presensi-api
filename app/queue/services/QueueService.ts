import Job from '#models/core/job'
import { DateTime } from 'luxon'

export class QueueService {
    defaultDelay    =   60

    async dispatch(jobClass: any, payload: any, delayInSeconds?: number) {
        const delay         = delayInSeconds ?? this.defaultDelay
        const now           = DateTime.now()
        const createdAt     = now
        const availableAt   = now.plus({ seconds: delay })

        await Job.create({
            type: jobClass.jobPath,
            payload: JSON.stringify(payload),
            attempts: 0,
            max_attempts: jobClass.maxAttempts ?? 3,
            available_at: availableAt,
            created_at: createdAt,
        })
    }

    async batch(jobs: { jobClass: any; payload: any; delay?: number }[]) {
        const inserts = jobs.map(({ jobClass, payload, delay }) => {
            const now           = DateTime.now()
            const actualDelay   = delay ?? this.defaultDelay

            return {
                type: jobClass.jobPath,
                payload: JSON.stringify(payload),
                attempts: 0,
                max_attempts: jobClass.maxAttempts ?? 3,
                available_at: now.plus({ seconds: actualDelay }),
                created_at: now,
            }
        })

        await Job.createMany(inserts)
    }

    async runWorker() {
        const job           = await Job.query().where('available_at', '<=', DateTime.now().toSQL()).orderBy('id', 'asc').first()

        if (!job) return

        const JobClass      = (await import(`#jobs/${job.type}`)).default
        const jobInstance   = new JobClass(job.payload)

        try {
            await jobInstance.handle()

            await job.delete()
        } catch (error) {
            await job.merge({ attempts: job.attempts + 1 }).save()

            console.error('Job failed:', job.type, error)
        }
    }

    async start(interval = 5000) {
        setInterval(async () => {
            try {
                await this.runWorker()
            } catch (error) {
                console.error('Queue worker error:', error)
            }
        }, interval)
    }
}

export const Queue = new QueueService()
