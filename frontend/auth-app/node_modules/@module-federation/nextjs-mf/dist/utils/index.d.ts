/**
 * Flushes chunks from the module federation node utilities.
 * @module @module-federation/node/utils
 */
export { flushChunks } from '@module-federation/node/utils';
/**
 * Exports the FlushedChunks component from the current directory.
 */
export { FlushedChunks } from './flushedChunks';
/**
 * Exports the FlushedChunksProps type from the current directory.
 */
export type { FlushedChunksProps } from './flushedChunks';
/**
 * Revalidates the current state.
 * If the function is called on the client side, it logs an error and returns a resolved promise with false.
 * If the function is called on the server side, it imports the revalidate function from the module federation node utilities and returns the result of calling that function.
 * @returns {Promise<boolean>} A promise that resolves with a boolean.
 */
export declare const revalidate: (fetchModule?: any, force?: boolean) => Promise<boolean>;
