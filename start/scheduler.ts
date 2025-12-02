import { handleCheckBySistemSchedule } from '#schedulers/CheckBySistemSchedule';
import scheduler from 'adonisjs-scheduler/services/main'

// scheduler.command("inspire").everyFiveSeconds();

scheduler.call(handleCheckBySistemSchedule).dailyAt('04:00')