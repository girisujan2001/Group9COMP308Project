import type { RuleSetConditionAbsolute } from 'webpack';
/**
 * Compares two regular expressions or other types of conditions to see if they are equal.
 *
 * @param x - The first condition to compare. It can be a string, a RegExp, a function that takes a string and returns a boolean, an array of RuleSetConditionAbsolute, or undefined.
 * @param y - The second condition to compare. It is always a RegExp.
 * @returns True if the conditions are equal, false otherwise.
 *
 * @remarks
 * This function compares two conditions to see if they are equal in terms of their source,
 * global, ignoreCase, and multiline properties. It is used to check if two conditions match
 * the same pattern. If the first condition is not a RegExp, the function will always return false.
 */
export declare const regexEqual: (x: string | RegExp | ((value: string) => boolean) | RuleSetConditionAbsolute[] | undefined, y: RegExp) => boolean;
