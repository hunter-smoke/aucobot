import { BellIcon, CpuChipIcon } from "@heroicons/react/24/outline";

import { MetaFutureRow } from "./MetaFutureRow";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Meta/MetaFutureRow",
  component: MetaFutureRow,
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
} satisfies Meta<typeof MetaFutureRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  args: { icon: BellIcon, label: "Thông báo", trailing: "toggle" },
};

export const Badge: Story = {
  args: { icon: CpuChipIcon, label: "Agent trong phòng", trailing: "badge" },
};
