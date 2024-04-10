import * as React from "react";
/**
 * This import is used by the Svelte SDK. Do not remove.
 */
export interface ImgProps {
    attributes?: any;
    imgSrc?: string;
    image?: string;
    altText?: string;
    backgroundSize?: "cover" | "contain";
    backgroundPosition?: "center" | "top" | "left" | "right" | "bottom" | "top left" | "top right" | "bottom left" | "bottom right";
}
declare function ImgComponent(props: ImgProps): React.JSX.Element;
export default ImgComponent;
