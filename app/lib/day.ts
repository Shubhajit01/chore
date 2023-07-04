import day from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

day.extend(relativeTime);
export default day;

export const relative = (date: string | Date) => day().to(day(date));
