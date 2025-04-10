import type { Compiler } from 'webpack';
/**
 * This plugin removes eager modules from the runtime.
 * @class RemoveEagerModulesFromRuntimePlugin
 */
declare class RemoveEagerModulesFromRuntimePlugin {
    private container;
    private debug;
    private modulesToProcess;
    /**
     * Creates an instance of RemoveEagerModulesFromRuntimePlugin.
     * @param {Object} options - The options for the plugin.
     * @param {string} options.container - The container to remove modules from.
     * @param {boolean} options.debug - Whether to log debug information.
     */
    constructor(options: {
        container?: string;
        debug?: boolean;
    });
    /**
     * Applies the plugin to the compiler.
     * @param {Compiler} compiler - The webpack compiler.
     */
    apply(compiler: Compiler): void;
    /**
     * Processes the modules in the chunk.
     * @param {Compilation} compilation - The webpack compilation.
     * @param {Chunk} chunk - The chunk to process.
     * @param {Iterable<Module>} modules - The modules in the chunk.
     */
    private processModules;
    /**
     * Removes the modules from the chunk.
     * @param {Compilation} compilation - The webpack compilation.
     * @param {Chunk} chunk - The chunk to remove modules from.
     */
    private removeModules;
}
export default RemoveEagerModulesFromRuntimePlugin;
