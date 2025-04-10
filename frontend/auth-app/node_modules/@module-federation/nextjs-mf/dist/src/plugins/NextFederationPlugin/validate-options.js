"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCompilerOptions = validateCompilerOptions;
exports.validatePluginOptions = validatePluginOptions;
/**
 * Validates the compiler options.
 *
 * @param {Compiler} compiler - The Webpack compiler instance.
 * @returns {boolean} - Returns true if the compiler options are valid, false otherwise.
 *
 * @throws Will throw an error if the name option is not defined in the options.
 * @remarks
 * This function validates the options passed to the Webpack compiler. It checks if the name option is set to either "server" or
 * "client", as Module Federation is only applied to the main server and client builds in Next.js.
 */
function validateCompilerOptions(compiler) {
    // Throw an error if the name option is not defined in the options
    if (!compiler.options.name) {
        throw new Error('name is not defined in Compiler options');
    }
    // Only apply Module Federation to the main server and client builds in Next.js
    return ['server', 'client'].includes(compiler.options.name);
}
/**
 * Validates the NextFederationPlugin options.
 *
 * @param {moduleFederationPlugin.ModuleFederationPluginOptions} options - The ModuleFederationPluginOptions instance.
 *
 * @throws Will throw an error if the filename option is not defined in the options or if the name option is not specified.
 * @remarks
 * This function validates the options passed to NextFederationPlugin. It ensures that the filename and name options are defined,
 * as they are required for using Module Federation.
 */
function validatePluginOptions(options) {
    // Throw an error if the filename option is not defined in the options
    if (!options.filename) {
        throw new Error('filename is not defined in NextFederation options');
    }
    // A requirement for using Module Federation is that a name must be specified
    if (!options.name) {
        throw new Error('Module federation "name" option must be specified');
    }
    return true;
}
//# sourceMappingURL=validate-options.js.map