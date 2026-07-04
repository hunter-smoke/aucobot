import { Composer } from "./Composer";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/Composer",
  component: Composer,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-chat)", width: "44rem" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onSend: (text: string) => console.log("send", text),
    onAttach: () => console.log("attach"),
    onImage: () => console.log("image"),
    onEmoji: () => console.log("emoji"),
    onVoice: () => console.log("voice"),
  },
} satisfies Meta<typeof Composer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Đang kết nối…" },
};
