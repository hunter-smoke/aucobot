import { applyDecorators } from "@nestjs/common";

import { Public } from "../../common/decorators/public.decorator";

/** Public route — no JWT cookie required. */
export function ApiPublic() {
  return applyDecorators(Public());
}
