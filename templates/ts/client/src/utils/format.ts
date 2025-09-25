/**
 * Format a date to a readable string
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/**
 * Format a number with commas
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number | null | undefined): string {
  if (typeof num !== "number") return "0";
  return num.toLocaleString();
}

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string | null | undefined, length: number = 100): string {
  if (!text || text.length <= length) return text || "";
  return text.substring(0, length) + "...";
}