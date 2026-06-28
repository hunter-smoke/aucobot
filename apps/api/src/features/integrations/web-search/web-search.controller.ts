import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { Public } from "../../../core/common/decorators/public.decorator";
import { WebSearchService } from "./web-search.service";

const searchSchema = z.object({
  query: z.string().min(1).max(500),
});

const fetchSchema = z.object({
  url: z.string().url(),
});

class SearchDto extends createZodDto(searchSchema) {}
class FetchDto extends createZodDto(fetchSchema) {}

@Controller("integrations/web-search")
@Public()
export class WebSearchController {
  constructor(private readonly webSearchService: WebSearchService) {}

  @Post("search")
  search(@Body() dto: SearchDto) {
    return this.webSearchService.search(dto.query);
  }

  @Post("fetch")
  fetch(@Body() dto: FetchDto) {
    return this.webSearchService.fetchUrl(dto.url);
  }
}
