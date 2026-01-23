/**
 * Format date from ISO string to Indonesian/English date format
 * @param dateString - ISO date string (e.g., "2026-01-23T16:36:19.000000Z")
 * @param lang - Language code ("id" for Indonesian, "en" for English)
 * @returns Formatted date string (e.g., "23 Januari 2026" or "January 23, 2026")
 */
export function formatDate(dateString: string, lang: "id" | "en" = "id"): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const months_id = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const months_en = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (lang === "id") {
    return `${day} ${months_id[month]} ${year}`;
  } else {
    return `${months_en[month]} ${day}, ${year}`;
  }
}

/**
 * Format date with time
 * @param dateString - ISO date string
 * @param lang - Language code
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string, lang: "id" | "en" = "id"): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const formattedDate = formatDate(dateString, lang);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${formattedDate}, ${hours}:${minutes}`;
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param dateString - ISO date string
 * @param lang - Language code
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string, lang: "id" | "en" = "id"): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (lang === "id") {
    if (diffSeconds < 60) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return formatDate(dateString, lang);
  } else {
    if (diffSeconds < 60) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString, lang);
  }
}
