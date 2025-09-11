import "reflect-metadata";
import { resolveDependencies } from "./dependencies/containers";
import { container } from "tsyringe";
import { ApplicationServiceKey } from "./dependencies/keys";
import { ApplicationService } from "./app/application-service";

/**
 * Aqui é realizado a configuração dos containers.
 */
resolveDependencies();

(async () => {
    /**
     * Aqui é realizada a recuperação de um container através do seu token.
     * Essa instância já terá todas as suas dependências injetadas.
     */
    const applicationService: ApplicationService = container.resolve(ApplicationServiceKey);

    await applicationService.orchestrate();
})();
