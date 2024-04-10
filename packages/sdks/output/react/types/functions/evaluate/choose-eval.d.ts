import type { ExecutorArgs } from './helpers.js';
/**
 * Even though we have separate runtimes for browser/node/edge, sometimes frameworks will
 * end up sending the server runtime code to the browser (most notably in dev mode).
 */
export declare const chooseBrowserOrServerEval: (args: ExecutorArgs) => any;