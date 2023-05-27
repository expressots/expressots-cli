import { provide } from "inversify-binding-decorators";

@provide(AzureProvider)
class AzureProvider {

    constructor() {}

}

export { AzureProvider };
