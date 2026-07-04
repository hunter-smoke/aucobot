import { mockRoomDetail, mockSessionDetail } from "@/mock/chat";

import { ChatHeader } from "./ChatHeader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/ChatHeader",
  component: ChatHeader,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-chat)", width: "44rem" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onOpenInfo: () => console.log("info"),
    onSearch: () => console.log("search"),
    onRename: () => console.log("rename"),
    onArchive: () => console.log("archive"),
    onDelete: () => console.log("delete"),
  },
} satisfies Meta<typeof ChatHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Room: Story = {
  args: { conversation: mockRoomDetail },
};

export const Session: Story = {
  args: {
    conversation: mockSessionDetail,
    subtitle: "Agent đang hoạt động",
  },
};
