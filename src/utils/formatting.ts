export const getLocalDate = (utcStr: string) => {
  const date = new Date(utcStr);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  return new Date(year, month, day);
};
