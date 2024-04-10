import * as React from "react";
type BlockWrapperProps = {
    Wrapper: string;
    block: BuilderBlock;
    context: BuilderContextInterface;
    linkComponent: any;
    children?: any;
};
/**
 * This component renders a block's wrapper HTML element (from the block's `tagName` property).
 */
import type { BuilderContextInterface } from "../../../context/types.js";
import type { BuilderBlock } from "../../../types/builder-block.js";
declare function BlockWrapper(props: BlockWrapperProps): React.JSX.Element;
export default BlockWrapper;
