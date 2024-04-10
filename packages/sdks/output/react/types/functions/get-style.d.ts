import type { BuilderContextInterface } from '../context/types.js';
import type { BuilderBlock } from '../types/builder-block.js';
export declare const getStyle: ({ block, context }: {
    block: BuilderBlock;
    context: BuilderContextInterface;
}) => string | Partial<CSSStyleDeclaration>;
/**
 * Svelte does not support style attribute as an object so we need to flatten it.
 *
 * Additionally, Svelte, Vue and other frameworks use kebab-case styles, so we need to convert them.
 */
export declare function mapStyleObjToStrIfNeeded(style: Partial<CSSStyleDeclaration>): string | Partial<CSSStyleDeclaration>;
