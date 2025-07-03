export function circuiBreaker(timeoutMs: number): Function {
    function validate(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod: Function = descriptor.value;

        descriptor.value = async function (this: any, ...args: any[]) {
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
                originalMethod.apply(this, args),
                abortPromise
            ]).finally(() => clearTimeout(timeout));
        };

        return descriptor;
    }

    return validate;
}
