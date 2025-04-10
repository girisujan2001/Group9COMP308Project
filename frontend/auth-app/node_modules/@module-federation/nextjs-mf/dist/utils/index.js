"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revalidate = exports.FlushedChunks = exports.flushChunks = void 0;
/**
 * Flushes chunks from the module federation node utilities.
 * @module @module-federation/node/utils
 */
var utils_1 = require("@module-federation/node/utils");
Object.defineProperty(exports, "flushChunks", { enumerable: true, get: function () { return utils_1.flushChunks; } });
/**
 * Exports the FlushedChunks component from the current directory.
 */
var flushedChunks_1 = require("./flushedChunks");
Object.defineProperty(exports, "FlushedChunks", { enumerable: true, get: function () { return flushedChunks_1.FlushedChunks; } });
/**
 * Revalidates the current state.
 * If the function is called on the client side, it logs an error and returns a resolved promise with false.
 * If the function is called on the server side, it imports the revalidate function from the module federation node utilities and returns the result of calling that function.
 * @returns {Promise<boolean>} A promise that resolves with a boolean.
 */
const revalidate = function (fetchModule = undefined, force = false) {
    if (typeof window !== 'undefined') {
        console.error('revalidate should only be called server-side');
        return Promise.resolve(false);
    }
    else {
        return Promise.resolve().then(() => __importStar(require('@module-federation/node/utils'))).then(function (utils) {
            return utils.revalidate(fetchModule, force);
        });
    }
};
exports.revalidate = revalidate;
//# sourceMappingURL=index.js.map