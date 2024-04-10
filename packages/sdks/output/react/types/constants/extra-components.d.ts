/**
 * These are in a separate file because React Native does not support them (yet).
 * Having them in a separate file allows us to override it to be empty in the
 * React Native SDK.
 */
import type { RegisteredComponent } from '../context/types.js';
export declare const getExtraComponents: () => RegisteredComponent[];
