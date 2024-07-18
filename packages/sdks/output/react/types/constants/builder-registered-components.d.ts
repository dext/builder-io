import type { RegisteredComponent } from '../context/types.js';
/**
 * Returns a list of all registered components.
 * NOTE: This needs to be a function to work around ESM circular dependencies.
 */
export declare const getDefaultRegisteredComponents: () => RegisteredComponent[];
