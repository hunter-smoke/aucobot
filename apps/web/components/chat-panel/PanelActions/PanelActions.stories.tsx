import { PanelActions } from "./PanelActions";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Panel/PanelActions",
  component: PanelActions,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-surface)", width: "21rem" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onArchive: () => console.log("archive"),
    onDelete: () => console.log("delete"),
  },
} satisfies Meta<typeof PanelActions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Room: Story = {
  args: { type: "room" },
};

export const Session: Story = {
  args: { type: "session" },
};
