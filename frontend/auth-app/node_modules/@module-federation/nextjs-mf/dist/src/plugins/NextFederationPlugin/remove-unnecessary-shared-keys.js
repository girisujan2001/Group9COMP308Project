"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUnnecessarySharedKeys = removeUnnecessarySharedKeys;
/**
 * Utility function to remove unnecessary shared keys from the default share scope.
 * It checks each key in the shared object against the default share scope.
 * If a key is found in the default share scope, a warning is logged and the key is removed from the shared object.
 *
 * @param {Record<string, unknown>} shared - The shared object to be checked.
 */
const internal_1 = require("../../internal");
/**
 * Function to remove unnecessary shared keys from the default share scope.
 * It iterates over each key in the shared object and checks against the default share scope.
 * If a key is found in the default share scope, a warning is logged and the key is removed from the shared object.
 *
 * @param {Record<string, unknown>} shared - The shared object to be checked.
 */
function removeUnnecessarySharedKeys(shared) {
    Object.keys(shared).forEach((key) => {
        /**
         * If the key is found in the default share scope, log a warning and remove the key from the shared object.
         */
        if (internal_1.DEFAULT_SHARE_SCOPE[key]) {
            console.warn(`%c[nextjs-mf] You are sharing ${key} from the default share scope. This is not necessary and can be removed.`, 'color: red');
            delete shared[key];
        }
    });
}
//# sourceMappingURL=remove-unnecessary-shared-keys.js.map