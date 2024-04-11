import type { BuilderContextInterface, RegisteredComponents } from '../../../../context/types.js';
import type { BuilderBlock } from '../../../../types/builder-block.js';
import type { BuilderDataProps } from '../../../../types/builder-props.js';
import type { InteractiveElementProps } from '../interactive-element';
type ComponentOptions = BuilderDataProps & {
    [index: string]: any;
    attributes?: {
        [index: string]: any;
    };
};
export interface ComponentProps {
    componentRef: any;
    componentOptions: ComponentOptions;
    blockChildren: BuilderBlock[];
    context: BuilderContextInterface;
    registeredComponents: RegisteredComponents;
    linkComponent: any;
    builderBlock: BuilderBlock;
    includeBlockProps: boolean;
    isInteractive: boolean | undefined;
}
export declare const getWrapperProps: ({ componentOptions, builderBlock, context, componentRef, includeBlockProps, isInteractive, contextValue }: Omit<ComponentProps, "registeredComponents" | "blockChildren"> & {
    contextValue: BuilderContextInterface;
}) => InteractiveElementProps | {
    attributes?: {
        'builder-id': string;
        style: string | Partial<CSSStyleDeclaration>;
        href: any;
    } | {
        [index: string]: any;
    };
    builderBlock: BuilderBlock;
    builderContext: BuilderContextInterface;
};
export {};
