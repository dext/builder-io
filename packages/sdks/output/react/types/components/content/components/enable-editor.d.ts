import * as React from "react";
type BuilderEditorProps = Omit<ContentProps, "customComponents" | "apiVersion" | "isSsrAbTest" | "blocksWrapper" | "blocksWrapperProps" | "isNestedRender"> & {
    builderContextSignal: BuilderContextInterface;
    setBuilderContextSignal?: (signal: any) => any;
    children?: any;
};
import type { BuilderContextInterface } from "../../../context/types.js";
import type { ContentProps } from "../content.types.js";
declare function EnableEditor(props: BuilderEditorProps): React.JSX.Element;
export default EnableEditor;
