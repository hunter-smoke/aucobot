/** Định dạng thời gian ngắn cho danh sách hội thoại (kiểu Telegram/Zalo). */

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Hôm nay → "14:05"; trong tuần → "T3"; xa hơn → "02/07".
 */
export function formatConversationTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (isSameDay(date, now)) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays < 7) {
    return WEEKDAYS[date.getDay()]!;
  }

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

/** Giờ:phút cho tin nhắn trong khung chat. */
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
