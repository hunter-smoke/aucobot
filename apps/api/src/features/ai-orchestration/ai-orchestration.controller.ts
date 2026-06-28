import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { Public } from "../../core/common/decorators/public.decorator";
import { AiOrchestrationService } from "./ai-orchestration.service";

const generateTextSchema = z.object({
  prompt: z.string().min(1).max(8000),
});

class GenerateTextDto extends createZodDto(generateTextSchema) {}

@Controller("ai")
@Public()
export class AiOrchestrationController {
  constructor(private readonly aiService: AiOrchestrationService) {}

  @Post("generate")
  async generate(@Body() dto: GenerateTextDto) {
    const text = await this.aiService.generateText(dto.prompt);
    return { text };
  }
}
