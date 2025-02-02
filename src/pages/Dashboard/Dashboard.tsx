import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { createHabit, fetchHabits as fetchHabitsRequest } from '@/requests';

// TODO: swap to rtk query instead of react query
export const Dashboard = () => {
  const { data, error, isPending } = useQuery(fetchHabitsRequest);

  const createHabitMutation = useMutation(createHabit);

  const [habitName, setHabitName] = useState<string>();
  const [habitColor, setHabitColor] = useState<string>();

  console.log({ data, error, isPending, habitColor, habitName });

  const onCreateHabit = async () => {
    try {
      // TODO: validate that color is a color
      // TODO: validate that habitName is not empty
      await createHabitMutation.mutateAsync({
        name: habitName,
        color: habitColor,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p>dis da dashboard</p>
      {/* <p>yearly activity</p> */}
      <input
        type="text"
        placeholder="habit name"
        onChange={(e) => setHabitName(e.target.value)}
      />
      <input
        type="color"
        placeholder="habit color"
        onChange={(e) => setHabitColor(e.target.value)}
      />
      <div>
        <button onClick={onCreateHabit}>create habit</button>
      </div>

      {data?.map((habit: any) => (
        <Link key={habit.id} to={`/habit/${habit.id}`}>
          <div
            key={habit.id}
            style={{
              display: 'flex',
              gap: 10,
              borderColor: habit.color,
              borderWidth: 2,
              borderStyle: 'solid',
              padding: 12,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'normal',
              // textAlign: 'center',
            }}
          >
            <span>{habit.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
