import cron from 'node-cron';

import { prisma } from '../config/prisma.js';
import { generateNextDates } from './cron-functions.js';

const runMaintenanceJobs = async () => {
  const maintenances = await prisma.maintenance.findMany({
    include: {
      maintenance_events: true,
      reminders: true,
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const maintenance of maintenances) {
    const allEvents = maintenance.maintenance_events.sort(
      (a, b) => a.due_date.getTime() - b.due_date.getTime(),
    );

    const futureEvents = allEvents.filter(e => !e.completion_date && e.due_date >= today);

    const lastEventDate =
      allEvents.length > 0
        ? new Date(Math.max(...allEvents.map(e => e.due_date.getTime())))
        : maintenance.start_date;

    const eventsToCreateCount = Math.max(0, 3 - futureEvents.length);

    const eventsToCreate =
      eventsToCreateCount > 0
        ? generateNextDates(
            lastEventDate,
            maintenance.repetition_value,
            maintenance.repetition_unit,
            eventsToCreateCount,
          )
        : [];

    if (eventsToCreate.length > 0) {
      await prisma.maintenance_events.createMany({
        data: eventsToCreate.map(dueDate => ({
          user_id: maintenance.user_id,
          maintenance_id: maintenance.id,
          due_date: dueDate,
        })),
        skipDuplicates: true,
      });
    }

    const allReminders = maintenance.reminders.sort(
      (a, b) => a.due_date.getTime() - b.due_date.getTime(),
    );

    const futureReminders = allReminders.filter(r => !r.is_sent && r.due_date >= today);

    const lastReminderDate =
      allReminders.length > 0
        ? new Date(Math.max(...allReminders.map(r => r.due_date.getTime())))
        : maintenance.start_date;

    const remindersToCreateCount = Math.max(0, 3 - futureReminders.length);

    const remindersToCreate =
      remindersToCreateCount > 0
        ? generateNextDates(
            lastReminderDate,
            maintenance.repetition_value,
            maintenance.repetition_unit,
            remindersToCreateCount,
          )
        : [];

    if (remindersToCreate.length > 0) {
      await prisma.reminders.createMany({
        data: remindersToCreate.map(dueDate => ({
          user_id: maintenance.user_id,
          maintenance_id: maintenance.id,
          due_date: dueDate,
        })),
        skipDuplicates: true,
      });
    }
  }

  console.log('Cron finished working');
};

export const startCronJobs = () => {
  cron.schedule('0,5 * * * *', runMaintenanceJobs);
};
