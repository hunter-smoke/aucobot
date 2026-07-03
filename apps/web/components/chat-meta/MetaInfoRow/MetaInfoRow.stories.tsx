import { MetaInfoRow } from "./MetaInfoRow";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Meta/MetaInfoRow",
  component: MetaInfoRow,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-surface)",
          padding: "var(--space-2)",
          width: "21rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetaInfoRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { label: "Loại", value: "Phòng" },
};

export const CopyableId: Story = {
  args: { label: "ID", value: "clx9abc123def456", copyable: true, mono: true },
};
