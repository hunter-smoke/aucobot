import {
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { generateTextWithTogether } from "@aucobot/llm-services";

@Injectable()
export class AiOrchestrationService {
  constructor(private readonly configService: ConfigService) {}

  async generateText(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>("togetherApiKey");

    if (!apiKey) {
      throw new ServiceUnavailableException("TOGETHER_API_KEY is not configured");
    }

    return generateTextWithTogether({ apiKey, prompt });
  }
}
