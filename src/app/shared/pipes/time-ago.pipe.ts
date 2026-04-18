import { Pipe, PipeTransform } from '@angular/core';

/**
 * 📅 Time Ago Pipe - Formats dates relative to now
 * Examples: "2 minutes ago", "1 day ago", "just now"
 */
@Pipe({
  name: 'timeAgo',
  standalone: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 1) {
      return 'just now';
    }

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [name, secondsInterval] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInterval);
      if (interval >= 1) {
        return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }
}
