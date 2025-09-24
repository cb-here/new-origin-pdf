export const formatDate = (date?: string | Date | null): string => {
  if (!date) return "-"; 

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-"; 

  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return `${month}/${day}/${year}`;
};
