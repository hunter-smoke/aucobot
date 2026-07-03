import { ChatMarkdown } from "./ChatMarkdown";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/ChatMarkdown",
  component: ChatMarkdown,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "32rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatMarkdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Rich: Story = {
  args: {
    content: `Đã lên **kế hoạch** cho chiến dịch Tết:

- Viết 5 caption theo brand kit
- Lên lịch đăng lúc \`09:00\`
- Theo dõi tương tác

Xem thêm ở [tài liệu](https://example.com).`,
  },
};

export const CodeBlock: Story = {
  args: {
    content: `Ví dụ bot đơn giản:

\`\`\`js
export function run(input) {
  return input.items.filter((p) => p.likes > 100);
}
\`\`\``,
  },
};
