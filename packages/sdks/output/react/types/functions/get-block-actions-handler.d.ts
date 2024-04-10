import type { BuilderContextInterface } from '../context/types.js';
import type { BuilderBlock } from '../types/builder-block.js';
type Options = {
    block: BuilderBlock;
} & Pick<BuilderContextInterface, 'localState' | 'context' | 'rootState' | 'rootSetState'>;
type EventHandler = (event: Event) => any;
export declare const createEventHandler: (value: string, options: Options) => EventHandler;
export {};
