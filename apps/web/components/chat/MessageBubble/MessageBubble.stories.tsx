import { MessageBubble } from "./MessageBubble";

import type { Message } from "@/types/chat";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const base: Omit<Message, "senderType" | "content"> = {
  id: "m",
  conversationId: "c",
  senderName: "Content",
  createdAt: new Date().toISOString(),
};

const meta = {
  title: "Chat/MessageBubble",
  component: MessageBubble,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-chat)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: "var(--space-4) 0",
          width: "40rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

export const User: Story = {
  args: {
    message: { ...base, senderType: "user", senderName: "Bạn", content: "Viết giúp mình 5 caption Tết nhé." },
  },
};

export const AgentMarkdown: Story = {
  args: {
    message: {
      ...base,
      senderType: "agent",
      content: "Đã xong! Mình gợi ý **3 hướng**:\n\n- Ấm áp gia đình\n- Hài hước\n- Sang trọng\n\nBạn thích hướng nào?",
    },
    showName: true,
  },
};

export const System: Story = {
  args: {
    message: { ...base, senderType: "system", senderName: "", content: "Phiên đã được tạo." },
  },
};

export const GroupedCluster: Story = {
  parameters: { controls: { disable: true } },
  args: {
    message: { ...base, senderType: "agent", content: "…" },
  },
  render: () => (
    <>
      <MessageBubble
        message={{ ...base, senderType: "agent", content: "Chào bạn 👋" }}
        showName
        isGroupStart
        isGroupEnd={false}
      />
      <MessageBubble
        message={{ ...base, senderType: "agent", content: "Mình là trợ lý Content." }}
        isGroupStart={false}
        isGroupEnd={false}
      />
      <MessageBubble
        message={{ ...base, senderType: "agent", content: "Cần mình giúp gì hôm nay?" }}
        isGroupStart={false}
        isGroupEnd
      />
      <MessageBubble
        message={{ ...base, senderType: "user", senderName: "Bạn", content: "Viết caption Tết" }}
        isGroupStart
        isGroupEnd={false}
      />
      <MessageBubble
        message={{ ...base, senderType: "user", senderName: "Bạn", content: "5 cái nhé" }}
        isGroupStart={false}
        isGroupEnd
      />
    </>
  ),
};
