import type { EvaluatorArgs } from './helpers.js';
type EvalValue = unknown;
export declare function evaluate({ code, context, localState, rootState, rootSetState, event, isExpression, enableCache }: EvaluatorArgs): EvalValue;
export {};
