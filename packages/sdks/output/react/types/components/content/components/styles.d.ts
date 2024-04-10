import * as React from "react";
interface Props {
    cssCode?: string;
    customFonts?: CustomFont[];
    contentId?: string;
    isNestedRender?: boolean;
}
import type { CustomFont } from "./styles.helpers.js";
declare function ContentStyles(props: Props): React.JSX.Element;
export default ContentStyles;
