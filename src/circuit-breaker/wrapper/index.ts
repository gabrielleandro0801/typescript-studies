import { circuitBreakerWrapper } from "./circuit-breaker-wrapper";

async function genericAsyncFn(): Promise<Response> {
    // This endpoint takes 10s to respond
    return await fetch("https://mp98f05d470e4d10e620.free.beeceptor.com/data");
}

async function callGenericAsyncFn(executionNumber: number, timeoutMs: number): Promise<void> {
    try {
        console.log(`=== Execution #${executionNumber} ===`);

        const response: Response = await circuitBreakerWrapper<() => Promise<Response>>(genericAsyncFn, [], timeoutMs);
        const status: number = response.status;
        const body: any = await response.json();

        console.log(`Execution #${executionNumber}`, "Success!. Status code:", status, "Body:", body);
    } catch (error) {
        console.error(`Execution #${executionNumber}`, "Error:", error.message);
    }
}

(async () => {
    // Execution 1
    // This execution waits for 15s, the the execution is successful
    await callGenericAsyncFn(1, 15_000);

    // Execution 2
    // This execution waits for 5s, the the execution is aborted
    await callGenericAsyncFn(2, 5_000);
})();
