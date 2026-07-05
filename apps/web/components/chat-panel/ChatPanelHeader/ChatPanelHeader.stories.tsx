import { ChatPanelHeader } from "./ChatPanelHeader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Panel/ChatPanelHeader",
  component: ChatPanelHeader,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-sidebar)",
          border: "1px solid var(--color-border)",
          width: "21rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    onClose: () => console.log("close"),
    onRename: () => console.log("rename"),
  },
} satisfies Meta<typeof ChatPanelHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Room: Story = {
  args: { type: "room" },
};

export const Session: Story = {
  args: { type: "session" },
};
