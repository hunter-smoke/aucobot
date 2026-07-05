import { expect, test } from "@playwright/test";

const USER_PROMPT =
  "@Trợ Lý soạn 3 caption Tết cho Facebook, tone ấm áp, có CTA mua quà";

function demoFrame(page: import("@playwright/test").Page) {
  return page.frameLocator('[data-testid="demo-frame"]');
}

async function waitForSimulator(page: import("@playwright/test").Page) {
  const section = page.locator("#live-demo");
  await section.scrollIntoViewIfNeeded();

  const frame = demoFrame(page);
  await frame.locator('[data-testid="fake-cursor"]').waitFor({
    state: "attached",
    timeout: 10_000,
  });

  return frame;
}

test.describe("LivePreview — chat simulator iframe", () => {
  test("hiện con trỏ giả khi scroll vào section", async ({ page }) => {
    await page.goto("/");
    const frame = await waitForSimulator(page);

    const cursor = frame.locator('[data-testid="fake-cursor"]');
    await expect(cursor).toBeVisible({ timeout: 5_000 });
  });

  test("gõ tin nhắn @Trợ Lý trong composer", async ({ page }) => {
    await page.goto("/#live-demo");
    const frame = await waitForSimulator(page);

    const chatInput = frame.locator('[data-testid="chat-input"]');
    await expect(chatInput).toContainText("@Trợ Lý", { timeout: 20_000 });
    await expect(chatInput).toContainText(USER_PROMPT.substring(8), {
      timeout: 5_000,
    });
  });

  test("replay reset về trạng thái ban đầu", async ({ page }) => {
    await page.goto("/#live-demo");
    const frame = await waitForSimulator(page);

    const chatInput = frame.locator('[data-testid="chat-input"]');
    await expect(chatInput).toContainText("@Trợ Lý", { timeout: 20_000 });

    await frame.locator('[data-testid="replay-btn"]').click();

    await expect(chatInput).toContainText("Nhắn tin", { timeout: 3_000 });
    await expect(frame.locator('[data-testid="fake-cursor"]')).toBeVisible({
      timeout: 5_000,
    });
  });
});
