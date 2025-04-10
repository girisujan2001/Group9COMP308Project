import type { LoaderContext } from 'webpack';
/**
 * Webpack loader which prepares MF map for NextJS pages.
 * This function is the main entry point for the loader.
 * It gets the options passed to the loader and prepares the pages map.
 * If the 'v2' option is passed, it prepares the pages map using the 'preparePageMapV2' function.
 * Otherwise, it uses the 'preparePageMap' function.
 * Finally, it calls the loader's callback function with the prepared pages map.
 *
 * @param {LoaderContext<Record<string, unknown>>} this - The loader context.
 */
export default function nextPageMapLoader(this: LoaderContext<Record<string, unknown>>): void;
/**
 * Webpack config generator for `exposes` option.
 * This function generates the webpack config for the 'exposes' option.
 * It creates a map of pages to modules and returns an object with the pages map and the pages map v2.
 *
 * @param {string} cwd - The current working directory.
 * @returns {Record<string, string>} The webpack config for the 'exposes' option.
 */
export declare function exposeNextjsPages(cwd: string): {
    './pages-map': string;
    './pages-map-v2': string;
};
