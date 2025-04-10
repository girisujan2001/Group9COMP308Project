"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This plugin removes eager modules from the runtime.
 * @class RemoveEagerModulesFromRuntimePlugin
 */
class RemoveEagerModulesFromRuntimePlugin {
    /**
     * Creates an instance of RemoveEagerModulesFromRuntimePlugin.
     * @param {Object} options - The options for the plugin.
     * @param {string} options.container - The container to remove modules from.
     * @param {boolean} options.debug - Whether to log debug information.
     */
    constructor(options) {
        this.container = options.container;
        this.debug = options.debug || false;
        this.modulesToProcess = new Set();
    }
    /**
     * Applies the plugin to the compiler.
     * @param {Compiler} compiler - The webpack compiler.
     */
    apply(compiler) {
        if (!this.container) {
            console.warn('[nextjs-mf]:', 'RemoveEagerModulesFromRuntimePlugin container is not defined:', this.container);
            return;
        }
        compiler.hooks.thisCompilation.tap('RemoveEagerModulesFromRuntimePlugin', (compilation) => {
            compilation.hooks.optimizeChunkModules.tap('RemoveEagerModulesFromRuntimePlugin', (chunks, modules) => {
                for (const chunk of chunks) {
                    if (chunk.hasRuntime() && chunk.name === this.container) {
                        this.processModules(compilation, chunk, modules);
                    }
                }
            });
        });
    }
    /**
     * Processes the modules in the chunk.
     * @param {Compilation} compilation - The webpack compilation.
     * @param {Chunk} chunk - The chunk to process.
     * @param {Iterable<Module>} modules - The modules in the chunk.
     */
    processModules(compilation, chunk, modules) {
        for (const module of modules) {
            if (!compilation.chunkGraph.isModuleInChunk(module, chunk)) {
                continue;
            }
            if (module.constructor.name === 'NormalModule') {
                this.modulesToProcess.add(module);
            }
        }
        this.removeModules(compilation, chunk);
    }
    /**
     * Removes the modules from the chunk.
     * @param {Compilation} compilation - The webpack compilation.
     * @param {Chunk} chunk - The chunk to remove modules from.
     */
    removeModules(compilation, chunk) {
        for (const moduleToRemove of this.modulesToProcess) {
            if (this.debug) {
                console.log('removing', moduleToRemove.constructor.name);
            }
            if (compilation.chunkGraph.isModuleInChunk(moduleToRemove, chunk)) {
                compilation.chunkGraph.disconnectChunkAndModule(chunk, moduleToRemove);
            }
        }
    }
}
exports.default = RemoveEagerModulesFromRuntimePlugin;
//# sourceMappingURL=RemoveEagerModulesFromRuntimePlugin.js.map