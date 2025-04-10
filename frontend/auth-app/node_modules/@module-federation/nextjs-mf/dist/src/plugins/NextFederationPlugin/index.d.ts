import type { NextFederationPluginOptions } from './next-fragments';
import type { Compiler } from 'webpack';
/**
 * NextFederationPlugin is a webpack plugin that handles Next.js application federation using Module Federation.
 */
export declare class NextFederationPlugin {
    private _options;
    private _extraOptions;
    name: string;
    /**
     * Constructs the NextFederationPlugin with the provided options.
     *
     * @param options The options to configure the plugin.
     */
    constructor(options: NextFederationPluginOptions);
    /**
     * The apply method is called by the webpack compiler and allows the plugin to hook into the webpack process.
     * @param compiler The webpack compiler object.
     */
    apply(compiler: Compiler): void;
    private validateOptions;
    private isServerCompiler;
    private applyConditionalPlugins;
    private getNormalFederationPluginOptions;
    private getNoopPath;
}
export default NextFederationPlugin;
