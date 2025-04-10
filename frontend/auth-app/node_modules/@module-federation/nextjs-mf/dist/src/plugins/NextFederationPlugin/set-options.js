"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOptions = setOptions;
function setOptions(options) {
    const { extraOptions, ...mainOpts } = options;
    /**
     * Default extra options for NextFederationPlugin.
     * @type {NextFederationPluginExtraOptions}
     */
    const defaultExtraOptions = {
        automaticPageStitching: false,
        enableImageLoaderFix: false,
        enableUrlLoaderFix: false,
        skipSharingNextInternals: false,
        debug: false,
    };
    return {
        mainOptions: mainOpts,
        extraOptions: { ...defaultExtraOptions, ...extraOptions },
    };
}
//# sourceMappingURL=set-options.js.map