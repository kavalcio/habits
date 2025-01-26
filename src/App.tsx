import './App.css';

import { id, init, lookup, tx } from '@instantdb/react';
import { useMemo, useState } from 'react';

import { DateColumn, EventCell } from './components';
import { Event, Habit, Schema, User } from './types';

// DO NOT COMMIT
const APP_ID = 'cbfffff4-cd5e-4756-8a33-c3afd38943f6';

const db = init<Schema>({ appId: APP_ID });

// TODO; do proper data linking
// TODO: add ability to create, rename, archive habits
// TODO: add ability to change color of habits
// TODO: add ability to change date range
// TODO: fetch and write user-specific data
// TODO: get api key from env
// TODO: prevent duplicate records somehow. maybe index events by `${userId}_${habitId}_${date}`?
// TODO: test offline mode
// TODO: add undo feature? and/or a history of changes
function App() {
  const { user } = db.useAuth();

  const { data, isLoading, error } = db.useQuery({
    habits: {
      events: {},
    },
  });

  // Index habits by their id and events by their date
  const formattedData = data?.habits?.reduce((acc: any, habit: Habit) => {
    acc[habit.name] = { ...habit, events: {} };
    habit.events.forEach((event) => {
      acc[habit.name].events[event.date] = event;
    });
    return acc;
  }, {});

  console.log({ data, formattedData });

  const dates = useMemo(() => {
    const d = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      d.push(
        date.toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      );
    }
    return d;
  }, []);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <DateColumn dates={dates} />
        {data?.habits?.map((habit: Habit) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <p>Habit: {habit.name}</p>
            {dates.map((date) => (
              <EventCell
                db={db}
                date={date}
                habitId={habit.id}
                eventId={formattedData?.[habit.name]?.events?.[date]?.id}
                isCompleted={
                  formattedData?.[habit.name]?.events?.[date]?.isCompleted
                }
              />
              // <button
              //   style={{
              //     backgroundColor: formattedData?.[habit.name]?.events?.[date]
              //       ?.isCompleted
              //       ? 'darkgreen'
              //       : 'orange',
              //   }}
              //   onClick={() => {
              //     const existingEventId =
              //       formattedData?.[habit.name]?.events?.[date]?.id;
              //     if (existingEventId) {
              //       db.transact([
              //         tx.events[existingEventId].merge({
              //           isCompleted:
              //             !formattedData?.[habit.name]?.events?.[date]
              //               ?.isCompleted,
              //         }),
              //       ]);
              //     } else {
              //       db.transact([
              //         tx.events[id()]
              //           .update({
              //             isCompleted: true,
              //             date,
              //           })
              //           .link({ habit: habit.id }),
              //       ]);
              //     }
              //   }}
              // >
              //   <p>{date}</p>
              // </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
