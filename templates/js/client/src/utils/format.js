/**
 * Format a date to a readable string
 * @param {string | Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
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
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (typeof num !== "number") return "0";
  return num.toLocaleString();
}

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + "...";
}