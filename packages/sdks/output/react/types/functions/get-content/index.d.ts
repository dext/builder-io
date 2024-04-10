import type { BuilderContent } from '../../types/builder-content.js';
import type { GetContentOptions } from './types.js';
/**
 * Returns the first content entry that matches the given options.
 */
export declare function fetchOneEntry(options: GetContentOptions): Promise<BuilderContent | null>;
type ContentResults = {
    results: BuilderContent[];
};
/**
 * @internal Exported only for testing purposes. Do not use.
 */
export declare const _processContentResult: (options: GetContentOptions, content: ContentResults, url?: URL) => Promise<BuilderContent[]>;
/**
 * Returns a paginated array of entries that match the given options.
 */
export declare function fetchEntries(options: GetContentOptions): Promise<BuilderContent[]>;
export {};
