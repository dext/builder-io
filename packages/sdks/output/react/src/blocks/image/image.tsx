import * as React from "react";
import { getSrcSet } from "./image.helpers.js";
import type { ImageProps } from "./image.types.js";

function Image(props: ImageProps) {
  function srcSetToUse() {
    const imageToUse = props.image || props.src;
    const url = imageToUse;
    if (
      !url ||
      // We can auto add srcset for cdn.builder.io and shopify
      // images, otherwise you can supply this prop manually
      !(url.match(/builder\.io/) || url.match(/cdn\.shopify\.com/))
    ) {
      return props.srcset;
    }
    if (props.srcset && props.image?.includes("builder.io/api/v1/image")) {
      if (!props.srcset.includes(props.image.split("?")[0])) {
        console.debug("Removed given srcset");
        return getSrcSet(url);
      }
    } else if (props.image && !props.srcset) {
      return getSrcSet(url);
    }
    return getSrcSet(url);
  }

  function webpSrcSet() {
    if (srcSetToUse?.()?.match(/builder\.io/) && !props.noWebp) {
      return srcSetToUse().replace(/\?/g, "?format=webp&");
    } else {
      return "";
    }
  }

  function aspectRatioCss() {
    const aspectRatioStyles = {
      position: "absolute",
      height: "100%",
      width: "100%",
      left: "0px",
      top: "0px",
    } as const;
    const out = props.aspectRatio ? aspectRatioStyles : undefined;
    return out;
  }

  return (
    <>
      <>
        <picture>
          {webpSrcSet() ? (
            <source type="image/webp" srcSet={webpSrcSet()} />
          ) : null}
          <img
            loading="lazy"
            alt={props.altText}
            role={props.altText ? undefined : "presentation"}
            style={{
              objectPosition: props.backgroundPosition || "center",
              objectFit: props.backgroundSize || "cover",
              ...aspectRatioCss(),
            }}
            className={
              "builder-image" +
              (props.className ? " " + props.className : "") +
              " img-a0c95e8c"
            }
            src={props.image}
            srcSet={srcSetToUse()}
            sizes={props.sizes}
          />
        </picture>
        {props.aspectRatio &&
        !(props.builderBlock?.children?.length && props.fitContent) ? (
          <div
            className="builder-image-sizer div-a0c95e8c"
            style={{
              paddingTop: props.aspectRatio! * 100 + "%",
            }}
          />
        ) : null}
        {props.builderBlock?.children?.length && props.fitContent ? (
          <>{props.children}</>
        ) : null}
        {!props.fitContent && props.children ? (
          <div className="div-a0c95e8c-2">{props.children}</div>
        ) : null}
      </>

      <style>{`.img-a0c95e8c {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}.div-a0c95e8c {
  width: 100%;
  pointer-events: none;
  font-size: 0;
}.div-a0c95e8c-2 {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`}</style>
    </>
  );
}

export default Image;
