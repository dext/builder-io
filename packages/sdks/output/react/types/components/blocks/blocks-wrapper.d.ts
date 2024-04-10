import * as React from "react";
export type BlocksWrapperProps = {
    blocks: BuilderBlock[] | undefined;
    parent: string | undefined;
    path: string | undefined;
    styleProp: Record<string, any> | undefined;
    /**
     * The element that wraps each list of blocks. Defaults to a `div` element ('ScrollView' in React Native).
     */
    BlocksWrapper: any;
    /**
     * Additonal props to pass to `blocksWrapper`. Defaults to `{}`.
     */
    BlocksWrapperProps: any;
    children?: any;
};
import type { BuilderBlock } from "../../types/builder-block.js";
declare function BlocksWrapper(props: BlocksWrapperProps): React.JSX.Element;
export default BlocksWrapper;
