import { TypingIndicator } from "./TypingIndicator";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/TypingIndicator",
  component: TypingIndicator,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-chat)", padding: "var(--space-4) 0", width: "40rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TypingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DotsOnly: Story = {};

export const WithLabel: Story = {
  args: { label: "Đang nghĩ" },
};
