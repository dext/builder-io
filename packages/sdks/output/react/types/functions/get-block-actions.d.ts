import type { BuilderContextInterface } from '../context/types.js';
import type { BuilderBlock } from '../types/builder-block.js';
type Actions = {
    [index: string]: (event: Event) => any;
};
export declare function getBlockActions(options: {
    block: BuilderBlock;
    stripPrefix?: boolean;
} & Pick<BuilderContextInterface, 'localState' | 'context' | 'rootState' | 'rootSetState'>): Actions;
export {};
