import ddTrace, { Span, Tracer } from "dd-trace";

const env: string = process.env.ENV || "";

const SERVICE_NAME: string = "my-app";

let tracer: Tracer;

export const initTracer = () => {
    try {
        if (!["hml", "prd"].includes(env)) {
            return;
        }

        tracer = ddTrace.init({
            plugins: true,
            logInjection: true,
            service: SERVICE_NAME,
        });
    } catch (error) {
        console.log({
            event: "initTracer",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const tagMultiple = (object: { [key: string]: any }) => {
    try {
        if (tracer && object) {
            const span: Span | null = tracer.scope().active();
            if (span !== null) {
                span.addTags(object);
            }
        }
    } catch (error) {
        console.log({
            event: "tagMultiple",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const getSpanIdAndTraceId = () => {
    let trace_id: string = "";
    let span_id: string = "";

    try {
        if (tracer) {
            const span: Span | null = tracer.scope().active();
            if (span !== null) {
                trace_id = span.context().toTraceId();
                span_id = span.context().toSpanId();
            }
        }
    } catch (error) {
        console.log({
            event: "getSpanIdAndTraceId",
            error: error instanceof Error ? error.message : String(error),
        });
    }

    return {
        trace_id,
        span_id,
    };
};

export const TraceClass = (name: string) => {
    return (clazz: any) => {
        try {
            if (tracer) {
                Object.getOwnPropertyNames(clazz.prototype)
                    .filter((x) => x !== "constructor")
                    .forEach(
                        (method) =>
                            (clazz.prototype[method] = tracer.wrap(`${name}.${method}`, clazz.prototype[method])),
                    );
            }
        } catch (error) {
            console.log({
                event: "TraceClass",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
};