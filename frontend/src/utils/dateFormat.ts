// Date formatting utilities
export const formatDateToUS = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',  
    year: 'numeric'
  });
};

export const formatDateFromUS = (usDateString: string): string => {
  if (!usDateString) return '';
  const parts = usDateString.split('/');
  if (parts.length !== 3) return '';
  
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const getCurrentDateUS = (): string => {
  return formatDateToUS(new Date().toISOString().split('T')[0]);
};