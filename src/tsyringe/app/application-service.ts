import { inject, injectable } from "tsyringe";
import { DomainServiceKey } from "../dependencies/keys";
import { DomainService } from "./domain-service";

@injectable()
export class ApplicationService {
    private readonly domainService: DomainService;

    constructor(
        @inject(DomainServiceKey)
        domainService: DomainService,
    ) {
        this.domainService = domainService;
    }

    async orchestrate() {
        console.log("ApplicationService.orchestrate");

        return await this.domainService.processImportantMethod();
    }
}
