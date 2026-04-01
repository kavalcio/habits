import { format } from 'date-fns';

import { HabitWithEvents } from '@/types';

const MAX_ACTIVITY_RANGE = 26;
// const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const calculateChartData = (habit?: HabitWithEvents) => {
  if (!habit) return null;

  const events = habit.event
    .map((e) => ({
      ...e,
      date: new Date(e.date),
      timestamp: new Date(e.date).getTime(),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

  // const eventCountAllTime = events.length;
  // const eventCountLast30Days = events.filter((event) => {
  //   return event.date >= thirtyDaysAgo && event.date <= currentDate;
  // }).length;
  // const eventCountLast12Months = events.filter((event) => {
  //   return event.date >= twelveMonthsAgo && event.date <= currentDate;
  // }).length;

  const firstEventDate = events.length > 0 ? events[0].date : null;
  const weekRange = firstEventDate
    ? Math.min(
        MAX_ACTIVITY_RANGE,
        Math.floor(
          (new Date().getTime() - firstEventDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        ),
      )
    : MAX_ACTIVITY_RANGE;

  const daysCompletedPerWeek = Array.from({
    length: weekRange,
  }).map((_, i) => ({
    startDate: new Date(new Date().setDate(new Date().getDate() - i * 7)),
    daysCompleted: 0,
    tagsCompleted: habit.habit_tag.reduce(
      (acc, ht) => {
        acc[ht.id] = 0;
        return acc;
      },
      {} as Record<number, any>,
    ),
  }));

  events.forEach((event) => {
    const weekIndex = Math.floor(
      (new Date().getTime() - event.date.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
    if (weekIndex >= 0 && weekIndex < weekRange) {
      daysCompletedPerWeek[weekIndex].daysCompleted += 1;
      event.event_tag.forEach((tag) => {
        daysCompletedPerWeek[weekIndex].tagsCompleted[tag.habit_tag_id] += 1;
      });
    }
  });
  daysCompletedPerWeek.reverse();

  const tagSeries = habit.habit_tag.reduce(
    (acc, ht) => {
      acc[ht.id] = {
        id: ht.id,
        name: ht.name,
        data: [],
      };
      return acc;
    },
    {} as Record<
      number,
      { id: number; name: string; data: { x: string; y: number }[] }
    >,
  );
  daysCompletedPerWeek.forEach((week) => {
    Object.keys(week.tagsCompleted).forEach((tag) => {
      tagSeries[+tag].data.push({
        x: format(week.startDate, 'MMM dd yyyy'),
        y: week.tagsCompleted[+tag],
      });
    });
  });

  // const averageEventsCompletedPerWeek =
  //   daysCompletedPerWeek.reduce((acc, week) => acc + week.daysCompleted, 0) /
  //   weekRange;

  return {
    // eventCountAllTime,
    // eventCountLast30Days,
    // eventCountLast12Months,
    daysCompletedPerWeek: {
      all: {
        name: 'All',
        data: daysCompletedPerWeek.map((week) => ({
          x: format(week.startDate, 'MMM dd, yyyy'),
          y: week.daysCompleted,
        })),
      },
      perTag: Object.values(tagSeries),
    },
    // averageEventsCompletedPerWeek,
  };
};
