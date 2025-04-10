import type { Compiler, WebpackPluginInstance } from 'webpack';
/**
 * Plugin to copy build output files.
 * @class
 */
declare class CopyBuildOutputPlugin implements WebpackPluginInstance {
    private isServer;
    /**
     * @param {boolean} isServer - Indicates if the current environment is server.
     * @constructor
     */
    constructor(isServer: boolean);
    /**
     * Applies the plugin to the compiler.
     * @param {Compiler} compiler - The webpack compiler object.
     * @method
     */
    apply(compiler: Compiler): void;
}
export default CopyBuildOutputPlugin;
