import type { BuilderContextInterface, RegisteredComponents } from '../../context/types.js';
import type { BuilderBlock } from '../../types/builder-block.js';
import type { RepeatData } from './types.js';
export declare const getComponent: ({ block, context, registeredComponents }: {
    block: BuilderBlock;
    context: BuilderContextInterface;
    registeredComponents: RegisteredComponents;
}) => import("../../context/types.js").RegisteredComponent;
export declare const getRepeatItemData: ({ block, context }: {
    block: BuilderBlock;
    context: BuilderContextInterface;
}) => RepeatData[] | undefined;
export declare const getInheritedStyles: ({ block, context }: {
    block: BuilderBlock;
    context: BuilderContextInterface;
}) => Partial<CSSStyleDeclaration>;
