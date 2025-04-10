/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Zackary Jackson @ScriptedAlchemy
 * This module contains the NextFederationPlugin class which is a webpack plugin that handles Next.js application federation using Module Federation.
 */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextFederationPlugin = void 0;
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const CopyFederationPlugin_1 = __importDefault(require("../CopyFederationPlugin"));
const nextPageMapLoader_1 = require("../../loaders/nextPageMapLoader");
const next_fragments_1 = require("./next-fragments");
const set_options_1 = require("./set-options");
const validate_options_1 = require("./validate-options");
const apply_server_plugins_1 = require("./apply-server-plugins");
const apply_client_plugins_1 = require("./apply-client-plugins");
const webpack_1 = require("@module-federation/enhanced/webpack");
const path_1 = __importDefault(require("path"));
/**
 * NextFederationPlugin is a webpack plugin that handles Next.js application federation using Module Federation.
 */
class NextFederationPlugin {
    /**
     * Constructs the NextFederationPlugin with the provided options.
     *
     * @param options The options to configure the plugin.
     */
    constructor(options) {
        const { mainOptions, extraOptions } = (0, set_options_1.setOptions)(options);
        this._options = mainOptions;
        this._extraOptions = extraOptions;
        this.name = 'ModuleFederationPlugin';
    }
    /**
     * The apply method is called by the webpack compiler and allows the plugin to hook into the webpack process.
     * @param compiler The webpack compiler object.
     */
    apply(compiler) {
        process.env['FEDERATION_WEBPACK_PATH'] =
            process.env['FEDERATION_WEBPACK_PATH'] ||
                (0, normalize_webpack_path_1.getWebpackPath)(compiler, { framework: 'nextjs' });
        if (!this.validateOptions(compiler))
            return;
        const isServer = this.isServerCompiler(compiler);
        new CopyFederationPlugin_1.default(isServer).apply(compiler);
        const normalFederationPluginOptions = this.getNormalFederationPluginOptions(compiler, isServer);
        this._options = normalFederationPluginOptions;
        this.applyConditionalPlugins(compiler, isServer);
        new webpack_1.ModuleFederationPlugin(normalFederationPluginOptions).apply(compiler);
        const noop = this.getNoopPath();
        if (!this._extraOptions.skipSharingNextInternals) {
            compiler.hooks.make.tapAsync('NextFederationPlugin', (compilation, callback) => {
                const dep = compiler.webpack.EntryPlugin.createDependency(noop, 'noop');
                compilation.addEntry(compiler.context, dep, { name: 'noop' }, (err, module) => {
                    if (err) {
                        return callback(err);
                    }
                    callback();
                });
            });
        }
        if (!compiler.options.ignoreWarnings) {
            compiler.options.ignoreWarnings = [
                //@ts-ignore
                (message) => /your target environment does not appear/.test(message),
            ];
        }
    }
    validateOptions(compiler) {
        const manifestPlugin = compiler.options.plugins.find((p) => p?.constructor?.name === 'BuildManifestPlugin');
        if (manifestPlugin) {
            //@ts-ignore
            if (manifestPlugin?.appDirEnabled) {
                throw new Error('App Directory is not supported by nextjs-mf. Use only pages directory, do not open git issues about this');
            }
        }
        const compilerValid = (0, validate_options_1.validateCompilerOptions)(compiler);
        const pluginValid = (0, validate_options_1.validatePluginOptions)(this._options);
        const envValid = process.env['NEXT_PRIVATE_LOCAL_WEBPACK'];
        if (compilerValid === undefined)
            console.error('Compiler validation failed');
        if (pluginValid === undefined)
            console.error('Plugin validation failed');
        const validCompilerTarget = compiler.options.name === 'server' || compiler.options.name === 'client';
        if (!envValid)
            throw new Error('process.env.NEXT_PRIVATE_LOCAL_WEBPACK is not set to true, please set it to true, and "npm install webpack"');
        return (compilerValid !== undefined &&
            pluginValid !== undefined &&
            validCompilerTarget);
    }
    isServerCompiler(compiler) {
        return compiler.options.name === 'server';
    }
    applyConditionalPlugins(compiler, isServer) {
        compiler.options.output.uniqueName = this._options.name;
        compiler.options.output.environment = {
            ...compiler.options.output.environment,
            asyncFunction: true,
        };
        (0, next_fragments_1.applyPathFixes)(compiler, this._options, this._extraOptions);
        if (this._extraOptions.debug) {
            compiler.options.devtool = false;
        }
        if (isServer) {
            (0, apply_server_plugins_1.configureServerCompilerOptions)(compiler);
            (0, apply_server_plugins_1.configureServerLibraryAndFilename)(this._options);
            (0, apply_server_plugins_1.applyServerPlugins)(compiler, this._options);
            (0, apply_server_plugins_1.handleServerExternals)(compiler, {
                ...this._options,
                shared: { ...(0, next_fragments_1.retrieveDefaultShared)(isServer), ...this._options.shared },
            });
        }
        else {
            (0, apply_client_plugins_1.applyClientPlugins)(compiler, this._options, this._extraOptions);
        }
    }
    getNormalFederationPluginOptions(compiler, isServer) {
        const defaultShared = this._extraOptions.skipSharingNextInternals
            ? {}
            : (0, next_fragments_1.retrieveDefaultShared)(isServer);
        return {
            ...this._options,
            runtime: false,
            remoteType: 'script',
            runtimePlugins: [
                ...(isServer
                    ? [require.resolve('@module-federation/node/runtimePlugin')]
                    : []),
                require.resolve(path_1.default.join(__dirname, '../container/runtimePlugin')),
                ...(this._options.runtimePlugins || []),
            ].map((plugin) => plugin + '?runtimePlugin'),
            //@ts-ignore
            exposes: {
                ...this._options.exposes,
                ...(this._extraOptions.exposePages
                    ? (0, nextPageMapLoader_1.exposeNextjsPages)(compiler.options.context)
                    : {}),
            },
            remotes: {
                ...this._options.remotes,
            },
            shared: {
                ...defaultShared,
                ...this._options.shared,
            },
            ...(isServer
                ? { manifest: { filePath: '' } }
                : { manifest: { filePath: '/static/chunks' } }),
            // nextjs project needs to add config.watchOptions = ['**/node_modules/**', '**/@mf-types/**'] to prevent loop types update
            dts: this._options.dts ?? false,
            shareStrategy: this._options.shareStrategy ?? 'loaded-first',
            experiments: {
                asyncStartup: true,
            },
        };
    }
    getNoopPath() {
        let noop;
        try {
            noop = require.resolve('../../federation-noop');
        }
        catch (e) {
            noop = require.resolve('../../federation-noop.cjs');
        }
        return noop;
    }
}
exports.NextFederationPlugin = NextFederationPlugin;
exports.default = NextFederationPlugin;
//# sourceMappingURL=index.js.map