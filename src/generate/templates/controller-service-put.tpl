import { BaseController, StatusCode } from "@expressots/core";
import { controller, {{method}}, requestBody, requestParam, response } from "inversify-express-utils";
import { Response } from "express";
import { {{className}}UseCase } from "./{{fileName}}.usecase";
import { I{{className}}RequestDTO, I{{className}}ResponseDTO } from "./{{fileName}}.dto";

@controller("/{{{route}}}")
class {{className}}Controller extends BaseController {

  constructor(private {{useCase}}UseCase: {{className}}UseCase) {
		super("{{construct}}-controller")
	}

  @{{method}}("/:id")
  execute(
      @requestParam("id") id: string,
      @requestBody() payload: I{{className}}RequestDTO,
      @response() res: Response,
  ): I{{className}}ResponseDTO {
      const data = {id, ...payload};
      return this.callUseCase(
            this.{{useCase}}UseCase.execute(data),
            res,
            StatusCode.OK,
      );
  }
}

export { {{className}}Controller };
