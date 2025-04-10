import type { moduleFederationPlugin } from '@module-federation/sdk';
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
export declare function setOptions(options: NextFederationPluginOptions): {
    mainOptions: moduleFederationPlugin.ModuleFederationPluginOptions;
    extraOptions: NextFederationPluginExtraOptions;
};
