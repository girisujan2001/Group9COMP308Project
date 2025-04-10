import type { Compiler } from 'webpack';
import type { moduleFederationPlugin } from '@module-federation/sdk';
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
export declare function validateCompilerOptions(compiler: Compiler): boolean;
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
export declare function validatePluginOptions(options: moduleFederationPlugin.ModuleFederationPluginOptions): boolean | void;
