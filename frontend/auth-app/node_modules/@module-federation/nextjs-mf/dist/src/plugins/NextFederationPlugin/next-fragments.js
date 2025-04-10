"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPathFixes = exports.retrieveDefaultShared = void 0;
const internal_1 = require("../../internal");
const helpers_1 = require("../../loaders/helpers");
const path_1 = __importDefault(require("path"));
/**
 * Set up default shared values based on the environment.
 * @param {boolean} isServer - Boolean indicating if the code is running on the server.
 * @returns {SharedObject} The default share scope based on the environment.
 */
const retrieveDefaultShared = (isServer) => {
    // If the code is running on the server, treat some Next.js internals as import false to make them external
    // This is because they will be provided by the server environment and not by the remote container
    if (isServer) {
        return internal_1.DEFAULT_SHARE_SCOPE;
    }
    // If the code is running on the client/browser, always bundle Next.js internals
    return internal_1.DEFAULT_SHARE_SCOPE_BROWSER;
};
exports.retrieveDefaultShared = retrieveDefaultShared;
const applyPathFixes = (compiler, pluginOptions, options) => {
    const match = (0, helpers_1.findLoaderForResource)(compiler.options.module.rules, {
        path: path_1.default.join(compiler.context, '/something/thing.js'),
        issuerLayer: undefined,
        layer: undefined,
    });
    compiler.options.module.rules.forEach((rule) => {
        if (typeof rule === 'object' && rule !== null) {
            const typedRule = rule;
            // next-image-loader fix which adds remote's hostname to the assets url
            if (options.enableImageLoaderFix &&
                (0, helpers_1.hasLoader)(typedRule, 'next-image-loader')) {
                (0, helpers_1.injectRuleLoader)(typedRule, {
                    loader: require.resolve('../../loaders/fixImageLoader'),
                });
            }
            if (options.enableUrlLoaderFix && (0, helpers_1.hasLoader)(typedRule, 'url-loader')) {
                (0, helpers_1.injectRuleLoader)(typedRule, {
                    loader: require.resolve('../../loaders/fixUrlLoader'),
                });
            }
        }
    });
    if (match) {
        let matchCopy;
        if (match.use) {
            matchCopy = { ...match };
            if (Array.isArray(match.use)) {
                matchCopy.use = match.use.filter((loader) => {
                    return (typeof loader === 'object' &&
                        loader.loader &&
                        !loader.loader.includes('react'));
                });
            }
            else if (typeof match.use === 'string') {
                matchCopy.use = match.use.includes('react') ? '' : match.use;
            }
            else if (typeof match.use === 'object' && match.use !== null) {
                matchCopy.use =
                    match.use.loader && match.use.loader.includes('react')
                        ? {}
                        : match.use;
            }
        }
        else {
            matchCopy = { ...match };
        }
        const descriptionDataRule = {
            ...matchCopy,
            descriptionData: {
                name: /^(@module-federation)/,
            },
            exclude: undefined,
            include: undefined,
        };
        const testRule = {
            ...matchCopy,
            resourceQuery: /runtimePlugin/,
            exclude: undefined,
            include: undefined,
        };
        const oneOfRule = compiler.options.module.rules.find((rule) => {
            return !!rule && typeof rule === 'object' && 'oneOf' in rule;
        });
        if (!oneOfRule) {
            compiler.options.module.rules.unshift({
                oneOf: [descriptionDataRule, testRule],
            });
        }
        else if (oneOfRule.oneOf) {
            oneOfRule.oneOf.unshift(descriptionDataRule, testRule);
        }
    }
};
exports.applyPathFixes = applyPathFixes;
//# sourceMappingURL=next-fragments.js.map