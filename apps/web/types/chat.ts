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

/** Trạng thái một việc agent đang/đã làm (gọi tool, chạy bước). */
export type AgentActivityStatus = "running" | "done" | "error";

/** Loại hành động — quyết định icon hiển thị trong timeline. */
export type AgentActionKind =
  | "thinking"
  | "web_search"
  | "read_document"
  | "write_content"
  | "build_workflow"
  | "schedule"
  | "publish"
  | "handoff"
  | "generic";

export interface AgentActivity {
  id: string;
  /** Nhãn việc: "Đang tìm kiếm web", "Soạn caption"… */
  label: string;
  status: AgentActivityStatus;
  /** Loại hành động (icon). Mặc định "generic". */
  kind?: AgentActionKind;
  /** Kết quả/ghi chú ngắn (tùy chọn). */
  detail?: string;
}

/** Trạng thái tổng của agent để hiển thị cuối thread. */
export type AgentState =
  | { kind: "idle" }
  | { kind: "thinking" }
  | { kind: "working"; activities: AgentActivity[] };

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
