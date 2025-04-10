/**
 * `fixUrlLoader` is a custom loader designed to modify the output of the url-loader.
 * It injects the PUBLIC_PATH from the webpack runtime into the output.
 * The output format is: `export default __webpack_require__.p + "/static/media/ssl.e3019f0e.svg"`
 *
 * `__webpack_require__.p` is a global variable in the webpack container that contains the publicPath.
 * For example, it could be: http://localhost:3000/_next
 *
 * @param {string} content - The original output from the url-loader.
 * @returns {string} The modified output with the injected PUBLIC_PATH.
 */
export declare function fixUrlLoader(content: string): string;
export default fixUrlLoader;
