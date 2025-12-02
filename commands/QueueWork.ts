import { BaseCommand } from '@adonisjs/core/ace'
import { Queue } from '#queues/services/QueueService'

export default class QueueWork extends BaseCommand {
    static commandName = 'queue:work'
    static options = { startApp: true }

    async run() {
        this.logger.info('Queue worker started...')

        while (true) {
            try {
                await Queue.runWorker()
            } catch (error) {
                console.error('Queue worker error:', error)
            }

            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }
}
