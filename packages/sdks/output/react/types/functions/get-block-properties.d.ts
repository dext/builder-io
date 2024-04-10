import type { BuilderContextInterface } from '../context/types.js';
import type { BuilderBlock } from '../types/builder-block.js';
export declare function getBlockProperties({ block, context }: {
    block: BuilderBlock;
    context: BuilderContextInterface;
}): {
    'builder-id': string;
    style: string | Partial<CSSStyleDeclaration>;
    href: any;
};
