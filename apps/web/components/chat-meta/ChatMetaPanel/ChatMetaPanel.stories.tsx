import { mockRoomDetail, mockSessionDetail } from "@/mock/chat";

import { ChatMetaPanel } from "./ChatMetaPanel";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Meta/ChatMetaPanel",
  component: ChatMetaPanel,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-panel)",
          display: "flex",
          height: "100vh",
          justifyContent: "flex-end",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    onClose: () => console.log("close"),
    onRename: (id: string) => console.log("rename", id),
    onArchive: (id: string) => console.log("archive", id),
    onDelete: (id: string) => console.log("delete", id),
  },
} satisfies Meta<typeof ChatMetaPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Room: Story = {
  args: { conversation: mockRoomDetail },
};

export const Session: Story = {
  args: { conversation: mockSessionDetail },
};
