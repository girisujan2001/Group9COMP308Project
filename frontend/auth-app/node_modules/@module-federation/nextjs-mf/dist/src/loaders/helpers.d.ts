import type { RuleSetRule, RuleSetUseItem } from 'webpack';
export declare function injectRuleLoader(rule: any, loader?: RuleSetUseItem): void;
/**
 * This function checks if the current module rule has a loader with the provided name.
 *
 * @param {RuleSetRule} rule - The current module rule.
 * @param {string} loaderName - The name of the loader to check.
 * @returns {boolean} Returns true if the current module rule has a loader with the provided name, otherwise false.
 */
export declare function hasLoader(rule: RuleSetRule, loaderName: string): boolean;
interface Resource {
    path: string;
    layer?: string;
    issuerLayer?: string;
}
export declare function findLoaderForResource(rules: RuleSetRule[], resource: Resource, path?: string[]): RuleSetRule | null;
export {};
