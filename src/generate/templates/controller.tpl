import { controller, httpGet, response } from "inversify-express-utils";

@controller("/")
class {{className}}Controller {
  
  constructor() { }

  @httpGet("/")
  execute(@response() res: any) {
    return res.send("You use case called here");
  }
}

export { {{className}}Controller };
