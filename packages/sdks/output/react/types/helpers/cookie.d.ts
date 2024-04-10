import type { CanTrack } from '../types/can-track.js';
type GetCookieArgs = {
    name: string;
} & CanTrack;
export declare const getCookieSync: ({ name, canTrack }: GetCookieArgs) => string | undefined;
/**
 * NOTE: This function is `async` because its react-native override is async. Do not remove the `async` keyword!
 * The sync version is only safe to use in code blocks that `react-native` is guaranteed not to not run.
 */
export declare const getCookie: (args: GetCookieArgs) => Promise<string>;
/**
 * NOTE: This function is `async` because its react-native override is async. Do not remove the `async` keyword!
 */
export declare const setCookie: ({ name, value, expires, canTrack }: {
    name: string;
    value: string;
    expires?: Date;
} & CanTrack) => Promise<void>;
export {};