import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { createEvent, deleteEvent } from '@/requests';
import { Tables } from '@/types';

import { Calendar } from './Calendar';
import { EditEventDialog } from './EditEventDialog';

export const EventCalendar = ({
  habitId,
  events,
}: {
  habitId: number;
  events?: Tables<'event'>[];
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);

  const onUpdateEvent = async () => {
    try {
      if (!selectedDate) return;
      const eventId = events?.find((e) => e.date === selectedDate)?.id;
      if (eventId) {
        await deleteEventMutation.mutateAsync(eventId);
      } else {
        await createEventMutation.mutateAsync({
          habitId,
          date: selectedDate,
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <EditEventDialog
      date={selectedDate || ''}
      isEventCompleted={
        !!selectedDate && !!events?.find((e) => e.date === selectedDate)
      }
      onClose={() => setSelectedDate(null)}
      onConfirm={onUpdateEvent}
    >
      <Calendar
        events={events}
        onDateSelect={setSelectedDate}
        enableDialogTrigger
      />
    </EditEventDialog>
  );
};
