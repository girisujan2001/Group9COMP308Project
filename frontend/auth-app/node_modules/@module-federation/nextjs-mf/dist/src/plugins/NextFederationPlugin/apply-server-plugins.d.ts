import type { WebpackOptionsNormalized, Compiler } from 'webpack';
import type { moduleFederationPlugin } from '@module-federation/sdk';
type EntryStaticNormalized = Awaited<ReturnType<Extract<WebpackOptionsNormalized['entry'], () => any>>>;
interface ModifyEntryOptions {
    compiler: Compiler;
    prependEntry?: (entry: EntryStaticNormalized) => void;
    staticEntry?: EntryStaticNormalized;
}
export declare function modifyEntry(options: ModifyEntryOptions): void;
/**
 * Applies server-specific plugins to the webpack compiler.
 *
 * @param {Compiler} compiler - The Webpack compiler instance.
 * @param {moduleFederationPlugin.ModuleFederationPluginOptions} options - The ModuleFederationPluginOptions instance.
 */
export declare function applyServerPlugins(compiler: Compiler, options: moduleFederationPlugin.ModuleFederationPluginOptions): void;
/**
 * Configures server-specific library and filename options.
 *
 * @param {ModuleFederationPluginOptions} options - The ModuleFederationPluginOptions instance.
 */
export declare function configureServerLibraryAndFilename(options: moduleFederationPlugin.ModuleFederationPluginOptions): void;
/**
 * Patches Next.js' default externals function to ensure shared modules are bundled and not treated as external.
 *
 * @param {Compiler} compiler - The Webpack compiler instance.
 * @param {ModuleFederationPluginOptions} options - The ModuleFederationPluginOptions instance.
 */
export declare function handleServerExternals(compiler: Compiler, options: moduleFederationPlugin.ModuleFederationPluginOptions): void;
/**
 * Configures server-specific compiler options.
 *
 * @param {Compiler} compiler - The Webpack compiler instance.
 */
export declare function configureServerCompilerOptions(compiler: Compiler): void;
export {};
