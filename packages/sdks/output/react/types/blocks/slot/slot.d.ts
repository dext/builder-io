import * as React from "react";
export type DropzoneProps = BuilderDataProps & {
    name: string;
    attributes: any;
};
import type { BuilderDataProps } from "../../types/builder-props.js";
declare function Slot(props: DropzoneProps): React.JSX.Element;
export default Slot;
