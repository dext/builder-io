import * as React from "react";
export type InteractiveElementProps = {
    Wrapper: any;
    block: BuilderBlock;
    context: BuilderContextInterface;
    wrapperProps: Dictionary<any>;
    includeBlockProps: boolean;
    children?: any;
};
import type { BuilderContextInterface } from "../../../context/types.js";
import type { BuilderBlock } from "../../../types/builder-block.js";
import type { Dictionary } from "../../../types/typescript.js";
declare function InteractiveElement(props: InteractiveElementProps): React.JSX.Element;
export default InteractiveElement;
