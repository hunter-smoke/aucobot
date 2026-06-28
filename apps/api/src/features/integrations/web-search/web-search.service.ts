import {
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { tavily } from "@tavily/core";

@Injectable()
export class WebSearchService {
  constructor(private readonly configService: ConfigService) {}

  private getClient() {
    const apiKey = this.configService.get<string>("tavilyApiKey");

    if (!apiKey) {
      throw new ServiceUnavailableException("TAVILY_API_KEY is not configured");
    }

    return tavily({ apiKey });
  }

  async search(query: string, maxResults = 5) {
    const client = this.getClient();
    return client.search(query, { maxResults });
  }

  async fetchUrl(url: string) {
    const client = this.getClient();
    return client.extract([url]);
  }
}
