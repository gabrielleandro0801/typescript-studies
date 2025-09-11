import { inject, singleton } from "tsyringe";
import { HttpClientKey, InfraGatewayKey } from "../dependencies/keys";

export interface IHttpClient {
    get(options: {}): Promise<any>;
    post(options: {}): Promise<any>;
}

@singleton()
export class InfraGateway {
    private readonly httpClient: IHttpClient;

    constructor(
        @inject(HttpClientKey)
        httpClient: IHttpClient,
    ) {
        this.httpClient = httpClient;
    }

    async getMetadata() {
        console.log("InfraGateway:getMetadata");

        return await this.httpClient.get({});
    }
}

@singleton()
export class InfraAdapter {
    private readonly infraGateway: InfraGateway;

    constructor(
        @inject(InfraGatewayKey)
        infraGateway: InfraGateway,
    ) {
        this.infraGateway = infraGateway;
    }

    async getData() {
        console.log("InfraAdapter:getData");

        return await this.infraGateway.getMetadata();
    }
}
