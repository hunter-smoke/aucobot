import { MetaActions } from "./MetaActions";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Meta/MetaActions",
  component: MetaActions,
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
} satisfies Meta<typeof MetaActions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Room: Story = {
  args: { type: "room" },
};

export const Session: Story = {
  args: { type: "session" },
};
