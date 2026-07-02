/**
 * Kiểu dữ liệu UI cho tầng chat (mock-first).
 * Tách khỏi contract API (`@aucobot/shared`) để dựng giao diện trước;
 * khi cắm API thật chỉ cần map sang các type này.
 */

export type ConversationType = "room" | "session";

export type SenderType = "user" | "agent" | "system";

/** Một dòng trong danh sách hội thoại (sidebar). */
export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  /** Preview nội dung tin nhắn cuối. */
  lastMessage: string;
  /** ISO string — dùng để hiển thị giờ và sắp xếp. */
  lastMessageAt: string;
  /** Số tin chưa đọc; 0 = không hiển thị badge. */
  unreadCount: number;
}

/** Một bong bóng tin nhắn trong khung chat. */
export interface Message {
  id: string;
  conversationId: string;
  senderType: SenderType;
  /** Tên người/agent gửi — hiển thị trong phòng nhiều thành viên. */
  senderName: string;
  content: string;
  createdAt: string;
}
