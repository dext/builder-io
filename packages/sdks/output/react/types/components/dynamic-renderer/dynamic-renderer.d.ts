import * as React from "react";
export interface DynamicRendererProps {
    children?: any;
    TagName: any;
    attributes: any;
    actionAttributes: any;
}
declare function DynamicRenderer(props: DynamicRendererProps): React.JSX.Element;
export default DynamicRenderer;
