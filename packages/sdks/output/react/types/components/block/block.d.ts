import * as React from "react";
export type BlockProps = {
    block: BuilderBlock;
    context: BuilderContextInterface;
    registeredComponents: RegisteredComponents;
    linkComponent: any;
};
import type { BuilderContextInterface, RegisteredComponents } from "../../context/types.js";
import type { BuilderBlock } from "../../types/builder-block.js";
declare function Block(props: BlockProps): React.JSX.Element;
export default Block;
