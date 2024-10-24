import { contextWrapper } from "./context-wrapper";

// Cada "run" abre um novo contexto
// onde as variáveis definidas não interferem em outras execuções
contextWrapper.run(async () => {
    contextWrapper.correlationId = "correlationId1";
    contextWrapper.serviceName = "serviceName1";

    console.log({
        serviceName: contextWrapper.serviceName,
        requestType: contextWrapper.requestType,
        executionId: contextWrapper.executionId,
        correlationId: contextWrapper.correlationId,
    });
});

contextWrapper.run(async () => {
    contextWrapper.correlationId = "correlationId2";
    contextWrapper.serviceName = "serviceName2";

    console.log({
        serviceName: contextWrapper.serviceName,
        requestType: contextWrapper.requestType,
        executionId: contextWrapper.executionId,
        correlationId: contextWrapper.correlationId,
    });
});
