import { useState } from 'react';

import { HabitWithEvents } from '@/types';

import { Calendar } from './Calendar';
import { EditEventDialog } from './EditEventDialog';

export const EventCalendar = ({ habit }: { habit: HabitWithEvents }) => {
  const { event: events = [] } = habit || {};
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <EditEventDialog
      date={selectedDate || ''}
      habit={habit}
      event={
        selectedDate ? events?.find((e) => e.date === selectedDate) : undefined
      }
      onClose={() => setSelectedDate(null)}
    >
      <Calendar
        events={events}
        onDateSelect={setSelectedDate}
        enableDialogTrigger
      />
    </EditEventDialog>
  );
};
