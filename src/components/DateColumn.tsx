export const DateColumn = ({ dates }: any) => {
  return (
    <div>
      {dates.map((date: any) => (
        <p>{date}</p>
      ))}
    </div>
  );
};
