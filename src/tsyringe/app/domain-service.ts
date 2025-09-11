import { inject, singleton } from "tsyringe";
import { InfraAdapterKey } from "../dependencies/keys";
import { InfraAdapter } from "./infra-adapter";

@singleton()
export class DomainService {
    private readonly infraAdapter: InfraAdapter;

    constructor(
        @inject(InfraAdapterKey)
        infraAdapter: InfraAdapter,
    ) {
        this.infraAdapter = infraAdapter;
    }

    async processImportantMethod() {
        console.log("DomainService:processImportantMethod");

        return await this.infraAdapter.getData();
    }
}
