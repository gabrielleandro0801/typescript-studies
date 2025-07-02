export async function circuitBreakerWrapper<
    T extends (...args: any[]) => any
>(
    originalFn: T,
    params: Parameters<T>,
    timeoutMs: number
): Promise<ReturnType<T>> {
    const controller: AbortController = new AbortController();
    const timeout: NodeJS.Timeout = setTimeout(() => {
        controller.abort()
    }, timeoutMs);

    const abortPromise: Promise<never> = new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
            reject(new Error('AbortError: Operation aborted due to timeout'));
        });
    });

    // Race between the original function and the abort
    return await Promise.race([
        originalFn(...params),
        abortPromise
    ]).finally(() => clearTimeout(timeout));
}
