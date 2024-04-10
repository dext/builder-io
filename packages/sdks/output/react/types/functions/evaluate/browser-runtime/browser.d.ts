import type { BuilderRenderState } from '../../../context/types.js';
import type { ExecutorArgs } from '../helpers.js';
export declare const runInBrowser: ({ code, builder, context, event, localState, rootSetState, rootState }: ExecutorArgs) => any;
export declare function flattenState({ rootState, localState, rootSetState }: {
    rootState: Record<string | symbol, any>;
    localState: Record<string | symbol, any> | undefined;
    rootSetState: ((rootState: BuilderRenderState) => void) | undefined;
}): BuilderRenderState;
