import type { Compiler } from 'webpack';
import type { moduleFederationPlugin, sharePlugin } from '@module-federation/sdk';
/**
 * Set up default shared values based on the environment.
 * @param {boolean} isServer - Boolean indicating if the code is running on the server.
 * @returns {SharedObject} The default share scope based on the environment.
 */
export declare const retrieveDefaultShared: (isServer: boolean) => sharePlugin.SharedObject;
export declare const applyPathFixes: (compiler: Compiler, pluginOptions: moduleFederationPlugin.ModuleFederationPluginOptions, options: any) => void;
export interface NextFederationPluginExtraOptions {
    enableImageLoaderFix?: boolean;
    enableUrlLoaderFix?: boolean;
    exposePages?: boolean;
    skipSharingNextInternals?: boolean;
    automaticPageStitching?: boolean;
    debug?: boolean;
}
export interface NextFederationPluginOptions extends moduleFederationPlugin.ModuleFederationPluginOptions {
    extraOptions: NextFederationPluginExtraOptions;
}
