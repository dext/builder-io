/**
 * Convert deep object to a flat object with dots
 *
 * { foo: { bar: 'baz' }} -> { 'foo.bar': 'baz' }
 */
export declare function flatten<T extends Record<string, any>>(object: T, path?: string | null, separator?: string): T;
