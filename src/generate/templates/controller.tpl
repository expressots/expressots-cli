import { BaseController } from "@expressots/core";
import { controller, httpPost, requestBody, response } from "inversify-express-utils";

@controller("/")
class {{className}}Controller extends BaseController {

  constructor() {
		super("{{className}}-controller")
	}

  @httpPost("/")
  execute(@requestBody() data: any, @response() res: any) {
    return res.json(data);
  }
}

export { {{className}}Controller };
