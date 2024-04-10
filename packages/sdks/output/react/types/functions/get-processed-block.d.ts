import type { BuilderContextInterface } from '../context/types.js';
import type { BuilderBlock } from '../types/builder-block.js';
export declare function getProcessedBlock({ block, context, shouldEvaluateBindings, localState, rootState, rootSetState }: {
    block: BuilderBlock;
    /**
     * In some cases, we want to avoid evaluating bindings and only want framework-specific block transformation. It is
     * also sometimes too early to consider bindings, e.g. when we might be looking at a repeated block.
     */
    shouldEvaluateBindings: boolean;
} & Pick<BuilderContextInterface, 'localState' | 'context' | 'rootState' | 'rootSetState'>): BuilderBlock;
