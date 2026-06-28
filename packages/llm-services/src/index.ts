import { createTogetherAI } from "@ai-sdk/togetherai";
import { generateText } from "ai";

export const DEFAULT_TOGETHER_MODEL =
  "meta-llama/Llama-3.3-70B-Instruct-Turbo";

export function createTogetherProvider(apiKey: string) {
  return createTogetherAI({ apiKey });
}

export async function generateTextWithTogether(options: {
  apiKey: string;
  prompt: string;
  model?: string;
}): Promise<string> {
  const together = createTogetherProvider(options.apiKey);
  const result = await generateText({
    model: together(options.model ?? DEFAULT_TOGETHER_MODEL),
    prompt: options.prompt,
  });

  return result.text;
}
