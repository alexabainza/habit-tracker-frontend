import { format } from 'date-fns';

export const formatDate = (dateString: string, dateFormat: string = 'MMMM d, yyyy hh:mm a'): string => {
  return format(new Date(dateString), dateFormat);
};
