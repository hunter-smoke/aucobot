import { mockThreadMessages } from "@/mock/chat";

import { MessageList } from "./MessageList";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/MessageList",
  component: MessageList,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", height: "100vh", width: "44rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Thread: Story = {
  args: { messages: mockThreadMessages, showNames: true },
};

export const Empty: Story = {
  args: { messages: [] },
};

export const AgentThinking: Story = {
  args: {
    messages: mockThreadMessages,
    showNames: true,
    agentState: { kind: "thinking" },
  },
};

export const AgentWorking: Story = {
  args: {
    messages: mockThreadMessages,
    showNames: true,
    agentState: {
      kind: "working",
      activities: [
        { id: "a1", kind: "web_search", label: "Tìm xu hướng Tết", status: "done", detail: "12 kết quả" },
        { id: "a2", kind: "read_document", label: "Đọc brand kit", status: "done" },
        { id: "a3", kind: "write_content", label: "Đang viết caption", status: "running" },
      ],
    },
  },
};
