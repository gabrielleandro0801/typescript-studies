import { circuiBreaker } from "./circuit-breaker-decorator";

class MyClass {
    // A decorator does not support in time arguments to be passed
    // So, the timeout has to be set on the definition of the function

    @circuiBreaker(15_000)
    async asyncFnWithLongWaitTime(): Promise<Response> {
        // This endpoint takes 10s to respond
        return await fetch("https://mp98f05d470e4d10e620.free.beeceptor.com/data");
    }

    @circuiBreaker(7_000)
    async asyncFnWithShortWaitTime(): Promise<Response> {
        // This endpoint takes 10s to respond
        return await fetch("https://mp98f05d470e4d10e620.free.beeceptor.com/data");
    }
}

async function callGenericAsyncFn(executionNumber: number, targetFn): Promise<void> {
    try {
        console.log(`=== Execution #${executionNumber} ===`);

        const response = await targetFn();
        const status: number = response.status;
        const body: any = await response.json();

        console.log(`Execution #${executionNumber}`, "Success!. Status code:", status, "Body:", body);
    } catch (error) {
        console.error(`Execution #${executionNumber}`, "Error:", error.message);
    }
}

(async () => {
    const subject = new MyClass();

    // Execution 1
    // This execution waits for 15s, the the execution is successful
    await callGenericAsyncFn(1, subject.asyncFnWithLongWaitTime);

    // Execution 2
    // This execution waits for 5s, the the execution is aborted
    await callGenericAsyncFn(2, subject.asyncFnWithShortWaitTime);
})();
