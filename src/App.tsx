import './App.css';

import { id, init, lookup, tx } from '@instantdb/react';
import { useMemo, useState } from 'react';

// DO NOT COMMIT
const APP_ID = 'asd';

type Habit = {
  id: string;
  name: string;
  user: string;
  events: Event[];
  isArchived: boolean;
  color: string;
  createdAt: string;
};

type Event = {
  id: string;
  createdAt: string;
  date: string;
  habit: string;
  isCompleted: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  habits: Habit[];
  createdAt: string;
};

type Schema = {
  users: User;
  habits: Habit;
  events: Event;
};

const db = init<Schema>({ appId: APP_ID });

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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data?.habits?.map((habit: Habit) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p>Habit: {habit.name}</p>
            {dates.map((date) => (
              <button
                style={{
                  backgroundColor: formattedData?.[habit.name]?.events?.[date]
                    ?.isCompleted
                    ? 'darkgreen'
                    : 'orange',
                }}
                onClick={() => {
                  const existingEventId =
                    formattedData?.[habit.name]?.events?.[date]?.id;
                  if (existingEventId) {
                    db.transact([
                      tx.events[existingEventId].merge({
                        isCompleted:
                          !formattedData?.[habit.name]?.events?.[date]
                            ?.isCompleted,
                      }),
                    ]);
                  } else {
                    db.transact([
                      tx.events[id()]
                        .update({
                          isCompleted: true,
                          date,
                          createdAt: new Date().toISOString(),
                        })
                        .link({ habit: habit.id }),
                    ]);
                  }
                }}
              >
                <p>{date}</p>
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
