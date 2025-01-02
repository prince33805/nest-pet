import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Formats a date to a string in the format YYYY-MM-DD HH:mm:ss.SS
 * adjusted to the specified time zone.
 * @param date - The date to format.
 * @param timeZone - The time zone to adjust to.
 * @returns A formatted timestamp string.
 */
export function formatToDatabaseTimestamp(date: Date, timeZone: string): string {
    if (!date) {
        return null; // Handle null or undefined dates
    }
    const zonedDate = toZonedTime(date, timeZone); // Convert to the desired time zone
    return format(zonedDate, "yyyy-MM-dd HH:mm:ss");
}
