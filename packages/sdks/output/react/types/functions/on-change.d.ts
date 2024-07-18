export declare const onChangeProxySymbol: unique symbol;
/**
 * Deeply observe an object and run a callback when it changes
 *
 * See ./on-change.test.ts for more info
 */
export declare function onChange<T extends object = any>(obj: T, cb: () => void): T;
