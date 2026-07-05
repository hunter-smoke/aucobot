import { mockRoomDetail, mockSessionDetail } from "@/mock/chat";

import { ChatPanelIdentity } from "./ChatPanelIdentity";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Panel/ChatPanelIdentity",
  component: ChatPanelIdentity,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-surface)", width: "21rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatPanelIdentity>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Room: Story = {
  args: { conversation: mockRoomDetail },
};

export const SessionNoDescription: Story = {
  args: { conversation: mockSessionDetail },
};
