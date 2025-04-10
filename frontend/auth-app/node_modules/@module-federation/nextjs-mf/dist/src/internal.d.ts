import type { sharePlugin } from '@module-federation/sdk';
/**
 * @typedef SharedObject
 * @type {object}
 * @property {object} [key] - The key representing the shared object's package name.
 * @property {boolean} key.singleton - Whether the shared object should be a singleton.
 * @property {boolean} key.requiredVersion - Whether a specific version of the shared object is required.
 * @property {boolean} key.eager - Whether the shared object should be eagerly loaded.
 * @property {boolean} key.import - Whether the shared object should be imported or not.
 */
export declare const DEFAULT_SHARE_SCOPE: sharePlugin.SharedObject;
/**
 * Defines a default share scope for the browser environment.
 * This function takes the DEFAULT_SHARE_SCOPE and sets eager to undefined and import to undefined for all entries.
 * For 'react', 'react-dom', 'next/router', and 'next/link', it sets eager to true.
 * The module hoisting system relocates these modules into the right runtime and out of the remote.
 *
 * @type {SharedObject}
 * @returns {SharedObject} - The modified share scope for the browser environment.
 */
export declare const DEFAULT_SHARE_SCOPE_BROWSER: sharePlugin.SharedObject;
/**
 * Parses the remotes object and checks if they are using a custom promise template or not.
 * If it's a custom promise template, the remote syntax is parsed to get the module name and version number.
 * If the remote value is using the standard remote syntax, a delegated module is created.
 *
 * @param {Record<string, any>} remotes - The remotes object to be parsed.
 * @returns {Record<string, string>} - The parsed remotes object with either the original value,
 * the value for internal or promise delegate module reference, or the created delegated module.
 */
export declare const parseRemotes: (remotes: Record<string, any>) => Record<string, string>;
/**
 * Extracts the delegate modules from the provided remotes object.
 * This function iterates over the remotes object and checks if each remote value is an internal delegate module reference.
 * If it is, the function adds it to the returned object.
 *
 * @param {Record<string, any>} remotes - The remotes object containing delegate module references.
 * @returns {Record<string, string>} - An object containing only the delegate modules from the remotes object.
 */
export declare const getDelegates: (remotes: Record<string, any>) => Record<string, string>;
/**
 * Transforms an array of Error objects into a single string. Each error message is formatted using the 'formatError' function.
 * The resulting error messages are then joined together, separated by newline characters.
 *
 * @param {Error[]} err - An array of Error objects that need to be formatted and combined.
 * @returns {string} - A single string containing all the formatted error messages, separated by newline characters.
 */
export declare const toDisplayErrors: (err: Error[]) => string;
