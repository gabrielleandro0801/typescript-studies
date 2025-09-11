import { container } from "tsyringe";
import { ApplicationService } from "../app/application-service";
import { DomainService } from "../app/domain-service";
import { IHttpClient, InfraAdapter, InfraGateway } from "../app/infra-adapter";
import { ApplicationServiceKey, DomainServiceKey, HttpClientKey, InfraAdapterKey, InfraGatewayKey } from "./keys";

export function resolveDependencies(): void {
    infra();
    application();
    domain();
}

function infra(): void {
    /**
     * Este registro de instância não utiliza uma classe propriamente,
     * mas um objeto que implementa a interface desejada.
     */
    container.registerInstance<IHttpClient>(HttpClientKey, {
        async get(options) {
            console.log("HttpClient:Get");
            return null;
        },
        async post(options) {
            console.log("HttpClient:Post");
            return null;
        },
    });
    /**
     * Este registro fornece uma instância única (Singleton) para o container.
     * Toda vez que o container registrado for recuperado será retornada a mesma instância.
     */
    container.registerSingleton<InfraGateway>(InfraGatewayKey, InfraGateway);
    container.registerSingleton<InfraAdapter>(InfraAdapterKey, InfraAdapter);
}

function application(): void {
    /**
     * Este registro não fornece uma instância única (Singleton), mas cada vez que
     * o container registrado for recuperado será criada uma instância nova.
     */
    container.register<ApplicationService>(ApplicationServiceKey, ApplicationService);
}

function domain(): void {
    container.registerSingleton<DomainService>(DomainServiceKey, DomainService);
}
