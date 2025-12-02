import scheduler from 'adonisjs-scheduler/services/main'

scheduler.command("inspire").everyFiveSeconds();

scheduler.call(async () => {
    console.log('P')
}).everySecond()
// .dailyAt('04:00')