import { format } from 'date-fns';

import { HabitWithEvents } from '@/types';

const WEEKLY_ACTIVITY_RANGE = 52;

export const calculateChartData = (habit?: HabitWithEvents) => {
  if (!habit) return null;

  const events = habit.event
    .map((e) => ({
      ...e,
      date: new Date(e.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

  const eventCountAllTime = events.length;
  const eventCountLast30Days = events.filter((event) => {
    return event.date >= thirtyDaysAgo && event.date <= currentDate;
  }).length;
  const eventCountLast12Months = events.filter((event) => {
    return event.date >= twelveMonthsAgo && event.date <= currentDate;
  }).length;

  const firstEventDate = events.length > 0 ? events[0].date : null;
  const weekRange = firstEventDate
    ? Math.floor(
        (new Date().getTime() - firstEventDate.getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      )
    : WEEKLY_ACTIVITY_RANGE;

  const daysCompletedPerWeek = Array.from({
    length: weekRange,
  }).map((_, i) => ({
    startDate: new Date(new Date().setDate(new Date().getDate() - i * 7)),
    daysCompleted: 0,
  }));

  events.forEach((event) => {
    const weekIndex = Math.floor(
      (new Date().getTime() - event.date.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
    if (weekIndex >= 0 && weekIndex < weekRange) {
      daysCompletedPerWeek[weekIndex].daysCompleted += 1;
    }
  });

  const averageEventsCompletedPerWeek =
    daysCompletedPerWeek.reduce((acc, week) => acc + week.daysCompleted, 0) /
    weekRange;

  return {
    eventCountAllTime,
    eventCountLast30Days,
    eventCountLast12Months,
    daysCompletedPerWeek: daysCompletedPerWeek.reverse().map((week) => ({
      x: format(week.startDate, 'MMM dd yyyy'),
      y: week.daysCompleted,
    })),
    averageEventsCompletedPerWeek,
  };
};
