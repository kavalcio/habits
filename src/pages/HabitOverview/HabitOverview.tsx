import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { fetchHabit } from '@/requests';

export const HabitOverview = () => {
  const { habitId } = useParams();
  const { data, error, isPending } = useQuery(fetchHabit(habitId));
  return (
    <div>
      <span>{data?.[0]?.name}</span>
    </div>
  );
};
