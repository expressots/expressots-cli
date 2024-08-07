import { provide } from "@expressots/core";
import { I{{className}}RequestDTO, I{{className}}ResponseDTO } from "./{{fileName}}.dto";

@provide({{className}}UseCase)
export class {{className}}UseCase {
    execute(payload: I{{className}}RequestDTO): I{{className}}ResponseDTO {
        return "Use Case";
    }
}
