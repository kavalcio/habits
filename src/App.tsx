import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { init, tx, id, lookup } from '@instantdb/react'

// DO NOT COMMIT
const APP_ID = 'asd'

type Habit = {
  id: string;
  activity: string;
  filled: boolean;
  date: string;
  createdAt: string;
}

type User = {
  id: string;
  name: string;
  email: string;
}

type Schema = {
  users: User;
  habits: Habit;
}

const db = init<Schema>({ appId: APP_ID });

function App() {
  const [count, setCount] = useState(0)

  const { user } = db.useAuth();

  const { data, isLoading, error } = db.useQuery({
    habits: {},
  });

  console.log({data, isLoading, error});

  // console.log(new Date().toLocaleDateString("en-CA", {year:"numeric", month: "2-digit", day:"2-digit"}));
  console.log(new Date().toISOString());
  return (
    <>
      {data?.habits?.map((habit: any) => (
        <button onClick={() => {
          db.transact([tx.habits[habit.id].merge({
            filled: !habit.filled,
          })]);
        }}>
          <p key={habit.id}>{habit.activity} - {habit.filled ? 'filled' : 'not filled'} - date: {habit.date}</p>
        </button>
      ))}
      <div className="card">
        <button onClick={() => {
          setCount((count) => count + 1);
          const date = new Date();
          db.transact([tx.habits[id()].update({
            activity: 'workout',
            filled: true,
            date: date.toLocaleDateString("en-CA", {year:"numeric", month: "2-digit", day:"2-digit"}),
            createdAt: date.toISOString(),
          })]);
        }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
