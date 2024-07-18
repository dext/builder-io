import * as React from "react";
type VariantsProviderProps = ContentVariantsPrps & {
    /**
     * For internal use only. Do not provide this prop.
     */
    isNestedRender?: boolean;
};
import type { ContentVariantsPrps } from "./content-variants.types.js";
declare function ContentVariants(props: VariantsProviderProps): React.JSX.Element;
export default ContentVariants;
