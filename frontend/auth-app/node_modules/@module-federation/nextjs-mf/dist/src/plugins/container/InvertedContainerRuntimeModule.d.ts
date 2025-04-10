declare const RuntimeModule: typeof import("webpack").RuntimeModule;
interface InvertedContainerRuntimeModuleOptions {
    name?: string;
    containers: Set<any>;
}
declare class InvertedContainerRuntimeModule extends RuntimeModule {
    private options;
    constructor(options: InvertedContainerRuntimeModuleOptions);
    generate(): string;
}
export default InvertedContainerRuntimeModule;
