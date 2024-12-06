import { format } from 'date-fns';

export const formatDate = (dateString: string, dateFormat: string = 'MMMM d, yyyy'): string => {
  return format(new Date(dateString), dateFormat);
};

export const formatDateToMMM_d = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};
