import * as React from "react";
export type BlockStylesProps = {
    block: BuilderBlock;
    context: BuilderContextInterface;
};
import type { BuilderContextInterface } from "../../../context/types.js";
import type { BuilderBlock } from "../../../types/builder-block.js";
declare function BlockStyles(props: BlockStylesProps): React.JSX.Element;
export default BlockStyles;
