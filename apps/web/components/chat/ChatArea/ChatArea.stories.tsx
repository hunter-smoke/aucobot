import { mockRoomDetail, mockThreadMessages } from "@/mock/chat";

import { ChatArea } from "./ChatArea";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/ChatArea",
  component: ChatArea,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onSend: (text: string) => console.log("send", text),
    onOpenInfo: () => console.log("info"),
    onRename: () => console.log("rename"),
    onArchive: () => console.log("archive"),
    onDelete: () => console.log("delete"),
  },
} satisfies Meta<typeof ChatArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: {
    conversation: mockRoomDetail,
    messages: mockThreadMessages,
  },
};

export const EmptyThread: Story = {
  args: {
    conversation: mockRoomDetail,
    messages: [],
  },
};

export const AgentThinking: Story = {
  args: {
    conversation: mockRoomDetail,
    messages: mockThreadMessages,
    agentState: { kind: "thinking" },
  },
};

export const AgentWorking: Story = {
  args: {
    conversation: mockRoomDetail,
    messages: mockThreadMessages,
    agentState: {
      kind: "working",
      activities: [
        { id: "a1", kind: "thinking", label: "Phân tích yêu cầu", status: "done" },
        { id: "a2", kind: "web_search", label: "Tìm xu hướng Tết trên TikTok", status: "done", detail: "12 kết quả" },
        { id: "a3", kind: "read_document", label: "Đọc brand kit", status: "done", detail: "3 tài liệu" },
        { id: "a4", kind: "write_content", label: "Đang soạn 5 caption", status: "running" },
      ],
    },
  },
};
