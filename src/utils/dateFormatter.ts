import { format } from 'date-fns';

export const formatDate = (dateString: string, dateFormat: string = 'MMMM d, yyyy'): string => {
  return format(new Date(dateString), dateFormat);
};
