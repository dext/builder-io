import type { BuilderContextInterface } from '../context/types.js';
import type { BuilderBlock } from '../types/builder-block.js';
export declare function transformStyleProperty({ style }: {
    style: Partial<CSSStyleDeclaration>;
    context: BuilderContextInterface;
    block: BuilderBlock;
}): Partial<CSSStyleDeclaration>;
