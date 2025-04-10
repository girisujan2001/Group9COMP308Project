import type { LoaderContext } from 'webpack';
/**
 * This loader is specifically created for tuning the next-image-loader result.
 * It modifies the regular string output of the next-image-loader.
 * For server-side rendering (SSR), it injects the remote scope of a specific remote URL.
 * For client-side rendering (CSR), it injects the document.currentScript.src.
 * After these injections, it selects the full URI before _next.
 *
 * @example
 * http://localhost:1234/test/test2/_next/static/media/ssl.e3019f0e.svg
 * will become
 * http://localhost:1234/test/test2
 *
 * @param {LoaderContext<Record<string, unknown>>} this - The loader context.
 * @param {string} remaining - The remaining part of the resource path.
 * @returns {string} The modified source code with the injected code.
 */
export declare function fixImageLoader(this: LoaderContext<Record<string, unknown>>, remaining: string): Promise<string>;
/**
 * The pitch function of the loader, which is the same as the fixImageLoader function.
 */
export declare const pitch: typeof fixImageLoader;
