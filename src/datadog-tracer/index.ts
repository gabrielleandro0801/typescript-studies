import { initTracer } from "./tracer";
initTracer();
import { ExampleService } from "./service";

(async () => {
    const service = new ExampleService();
    await service.exampleMethod({ key: "value" });
})();
