import { BaseController, StatusCode } from "@expressots/core";
import { controller, {{method}}, response } from "inversify-express-utils";
import { Response } from "express";
import { {{className}}UseCase } from "./{{fileName}}.usecase";
import { I{{className}}ResponseDTO } from "./{{fileName}}.dto";

@controller("/{{{route}}}")
class {{className}}Controller extends BaseController {

  constructor(private {{useCase}}UseCase: {{className}}UseCase) {
		super("{{construct}}-controller")
	}

  @{{method}}("/")
  execute(@response() res: Response): I{{className}}ResponseDTO {
    return this.callUseCase(
            this.{{useCase}}UseCase.execute(),
            res,
            StatusCode.OK,
    );
  }
}

export { {{className}}Controller };
