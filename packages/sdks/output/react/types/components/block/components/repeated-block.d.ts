import * as React from "react";
type Props = Omit<BlockProps, "context"> & {
    repeatContext: BuilderContextInterface;
};
import type { BuilderContextInterface } from "../../../context/types.js";
import type { BlockProps } from "../block";
declare function RepeatedBlock(props: Props): React.JSX.Element;
export default RepeatedBlock;
