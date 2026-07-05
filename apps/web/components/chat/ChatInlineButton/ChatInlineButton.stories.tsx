import { ChatInlineButton } from "./ChatInlineButton";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/ChatInlineButton",
  component: ChatInlineButton,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--chat-wallpaper)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          maxWidth: "22rem",
          padding: "var(--space-4)",
          width: "100%",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatInlineButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Duyệt",
    onClick: () => console.log("click"),
  },
};

export const Loading: Story = {
  args: {
    children: "Đang xử lý",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Từ chối",
    disabled: true,
  },
};

export const Stacked: Story = {
  parameters: { controls: { disable: true } },
  args: { children: "Duyệt" },
  render: () => (
    <>
      <ChatInlineButton onClick={() => console.log("approve")}>
        Duyệt
      </ChatInlineButton>
      <ChatInlineButton onClick={() => console.log("reject")}>
        Từ chối
      </ChatInlineButton>
      <ChatInlineButton onClick={() => console.log("edit")}>Sửa</ChatInlineButton>
    </>
  ),
};
