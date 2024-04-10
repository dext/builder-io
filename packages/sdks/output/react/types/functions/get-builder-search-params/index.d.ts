import type { QueryObject } from '../../helpers/search/search.js';
/**
 * Receives a `URLSearchParams` object or a regular query object, and returns the subset of query params that are
 * relevant to the Builder SDK.
 *
 * @returns
 */
export declare const getBuilderSearchParams: (_options: QueryObject | URLSearchParams | undefined) => QueryObject;
export declare const getBuilderSearchParamsFromWindow: () => QueryObject;