import type { Conversation, Message } from "@/types/chat";

/**
 * Dữ liệu giả cho tầng chat — dùng dựng UI và trong Storybook.
 * Thay bằng nguồn API thật sau mà không đụng component.
 */

const now = Date.now();
const minutes = (m: number) => new Date(now - m * 60_000).toISOString();
const hours = (h: number) => new Date(now - h * 3_600_000).toISOString();
const days = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const mockConversations: Conversation[] = [
  {
    id: "conv-tiktok",
    type: "room",
    title: "Team TikTok Q1",
    lastMessage: "Đã lên lịch 3 video cho tuần này.",
    lastMessageAt: minutes(2),
    unreadCount: 3,
  },
  {
    id: "conv-tet",
    type: "room",
    title: "Chiến dịch Tết 2026",
    lastMessage: "Content: caption mừng năm mới đã xong.",
    lastMessageAt: minutes(48),
    unreadCount: 0,
  },
  {
    id: "conv-caption",
    type: "session",
    title: "Soạn 5 caption Tết",
    lastMessage: "Bạn: viết thêm 2 caption ngắn hơn nhé",
    lastMessageAt: hours(3),
    unreadCount: 1,
  },
  {
    id: "conv-fb",
    type: "room",
    title: "Nội dung Facebook",
    lastMessage: "Publisher: bài đã đăng lúc 09:00.",
    lastMessageAt: hours(20),
    unreadCount: 0,
  },
  {
    id: "conv-report",
    type: "session",
    title: "Báo cáo tuần",
    lastMessage: "Tổng hợp engagement 7 ngày qua.",
    lastMessageAt: days(2),
    unreadCount: 0,
  },
  {
    id: "conv-spa",
    type: "room",
    title: "Spa Hương Sen",
    lastMessage: "Lên ý tưởng ưu đãi cuối tuần.",
    lastMessageAt: days(5),
    unreadCount: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    conversationId: "conv-tiktok",
    senderType: "user",
    senderName: "Bạn",
    content: "Chào team, tuần này mình cần 3 video ngắn về sản phẩm mới.",
    createdAt: minutes(30),
  },
  {
    id: "m2",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Content",
    content: "Đã ghi nhận. Mình sẽ viết kịch bản cho 3 video theo brand kit.",
    createdAt: minutes(28),
  },
  {
    id: "m3",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Scheduler",
    content: "Đã lên lịch 3 video cho tuần này.",
    createdAt: minutes(2),
  },
];
