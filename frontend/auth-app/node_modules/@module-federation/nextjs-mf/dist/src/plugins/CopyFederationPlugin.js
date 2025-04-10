"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
/**
 * Plugin to copy build output files.
 * @class
 */
class CopyBuildOutputPlugin {
    /**
     * @param {boolean} isServer - Indicates if the current environment is server.
     * @constructor
     */
    constructor(isServer) {
        this.isServer = isServer;
    }
    /**
     * Applies the plugin to the compiler.
     * @param {Compiler} compiler - The webpack compiler object.
     * @method
     */
    apply(compiler) {
        /**
         * Copies files from source to destination.
         * @param {string} source - The source directory.
         * @param {string} destination - The destination directory.
         * @async
         * @function
         */
        const copyFiles = async (source, destination) => {
            const files = await fs_1.promises.readdir(source);
            await Promise.all(files.map(async (file) => {
                const sourcePath = path_1.default.join(source, file);
                const destinationPath = path_1.default.join(destination, file);
                if ((await fs_1.promises.lstat(sourcePath)).isDirectory()) {
                    await fs_1.promises.mkdir(destinationPath, { recursive: true });
                    await copyFiles(sourcePath, destinationPath);
                }
                else {
                    await fs_1.promises.copyFile(sourcePath, destinationPath);
                }
            }));
        };
        compiler.hooks.afterEmit.tapPromise('CopyBuildOutputPlugin', async (compilation) => {
            const { outputPath } = compiler;
            const outputString = outputPath.split('server')[0];
            const isProd = compiler.options.mode === 'production';
            if (!isProd && !this.isServer) {
                return;
            }
            const serverLoc = path_1.default.join(outputString, this.isServer && isProd ? '/ssr' : '/static/ssr');
            const servingLoc = path_1.default.join(outputPath, 'ssr');
            await fs_1.promises.mkdir(serverLoc, { recursive: true });
            const sourcePath = this.isServer ? outputPath : servingLoc;
            try {
                await fs_1.promises.access(sourcePath);
                // If the promise resolves, the file exists and you can proceed with copying.
                await copyFiles(sourcePath, serverLoc);
            }
            catch (error) {
                // If the promise rejects, the file does not exist.
                console.error(`File at ${sourcePath} does not exist.`);
            }
        });
    }
}
exports.default = CopyBuildOutputPlugin;
//# sourceMappingURL=CopyFederationPlugin.js.map