import { id, InstantReactWeb, tx } from '@instantdb/react';

export const EventCell = ({
  db,
  date,
  habitId,
  eventId,
  isCompleted,
}: {
  db: InstantReactWeb;
  date: string;
  habitId: string;
  eventId?: string;
  isCompleted?: boolean;
}) => {
  return (
    <button
      style={{
        backgroundColor: isCompleted ? 'darkgreen' : 'orange',
        borderRadius: 6,
        width: 30,
        height: 30,
        padding: 0,
        // border: 'none',
        // outline: 'none',
      }}
      onClick={() => {
        if (eventId) {
          db.transact([
            tx.events[eventId].merge({
              isCompleted: !isCompleted,
            }),
          ]);
        } else {
          db.transact([
            tx.events[id()]
              .update({
                isCompleted: true,
                date,
              })
              .link({ habit: habitId }),
          ]);
        }
      }}
    >
      {/* <p>{date}</p> */}
    </button>
  );
};
