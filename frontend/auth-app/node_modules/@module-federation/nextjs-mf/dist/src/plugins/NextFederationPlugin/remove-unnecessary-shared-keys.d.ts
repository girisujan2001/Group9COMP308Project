/**
 * Function to remove unnecessary shared keys from the default share scope.
 * It iterates over each key in the shared object and checks against the default share scope.
 * If a key is found in the default share scope, a warning is logged and the key is removed from the shared object.
 *
 * @param {Record<string, unknown>} shared - The shared object to be checked.
 */
export declare function removeUnnecessarySharedKeys(shared: Record<string, unknown>): void;
