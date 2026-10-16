import { tagMultiple, TraceClass } from "./tracer";

@TraceClass("ExampleService")
export class ExampleService {
    async exampleMethod(input: { [key: string]: string }) {
        tagMultiple(input);
    }
}