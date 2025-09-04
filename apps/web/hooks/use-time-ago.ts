import { useMemo } from "react";

/**
 * This hook is used to format a date into a time ago string.
 * It works like this:
 * - < 1 minute: "Just now"
 * - < 1 hour: "X min ago"
 * - < 1 day: "X hours ago"
 * - < 1 week: "X days ago"
 * - < 1 month: "X weeks ago"
 * - > 1 month: "X months ago"
 * 
 * @param date - The date to format.
 * @returns The time ago string.
 */
export function useTimeAgo(date: Date | string): string {
  return useMemo(() => {
    const targetDate = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - targetDate.getTime();
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  }, [date]);
}
