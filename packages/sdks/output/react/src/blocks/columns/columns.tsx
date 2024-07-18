"use client";
import * as React from "react";
import { useState } from "react";

type CSSVal = string | number;
import Blocks from "../../components/blocks/blocks";
import DynamicRenderer from "../../components/dynamic-renderer/dynamic-renderer";
import InlinedStyles from "../../components/inlined-styles";
import type { SizeName } from "../../constants/device-sizes.js";
import { getSizesForBreakpoints } from "../../constants/device-sizes.js";
import { TARGET } from "../../constants/target.js";
import { deoptSignal } from "../../functions/deopt.js";
import { getClassPropName } from "../../functions/get-class-prop-name.js";
import { mapStyleObjToStrIfNeeded } from "../../functions/get-style.js";
import type { Dictionary } from "../../types/typescript.js";
import type { ColumnProps } from "./columns.types.js";

function Columns(props: ColumnProps) {
  function getGutterSize() {
    return typeof props.space === "number" ? props.space || 0 : 20;
  }

  function getColumns() {
    return props.columns || [];
  }

  function getStackAt() {
    return props.stackColumnsAt || "tablet";
  }

  function getWidth(index: number) {
    const columns = getColumns();
    return columns[index]?.width || 100 / columns.length;
  }

  function getColumnCssWidth(index: number) {
    const columns = getColumns();
    const subtractWidth =
      (getGutterSize() * (columns.length - 1)) / columns.length;
    return `calc(${getWidth(index)}% - ${subtractWidth}px)`;
  }

  function getTabletStyle({
    stackedStyle,
    desktopStyle,
  }: {
    stackedStyle: CSSVal;
    desktopStyle: CSSVal;
  }) {
    return getStackAt() === "tablet" ? stackedStyle : desktopStyle;
  }

  function getMobileStyle({
    stackedStyle,
    desktopStyle,
  }: {
    stackedStyle: CSSVal;
    desktopStyle: CSSVal;
  }) {
    return getStackAt() === "never" ? desktopStyle : stackedStyle;
  }

  const [flexDir, setFlexDir] = useState(() =>
    props.stackColumnsAt === "never"
      ? "row"
      : props.reverseColumnsWhenStacked
      ? "column-reverse"
      : "column"
  );

  function columnsCssVars() {
    return {
      "--flex-dir": flexDir,
      "--flex-dir-tablet": getTabletStyle({
        stackedStyle: flexDir,
        desktopStyle: "row",
      }),
    } as Dictionary<string>;
  }

  function columnCssVars(index: number) {
    const gutter = index === 0 ? 0 : getGutterSize();
    const width = getColumnCssWidth(index);
    const gutterPixels = `${gutter}px`;
    const mobileWidth = "100%";
    const mobileMarginLeft = 0;
    const marginLeftKey = "marginLeft";
    const sharedStyles = {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    };
    return {
      ...sharedStyles,
      width,
      [marginLeftKey]: gutterPixels,
      "--column-width-mobile": getMobileStyle({
        stackedStyle: mobileWidth,
        desktopStyle: width,
      }),
      "--column-margin-left-mobile": getMobileStyle({
        stackedStyle: mobileMarginLeft,
        desktopStyle: gutterPixels,
      }),
      "--column-width-tablet": getTabletStyle({
        stackedStyle: mobileWidth,
        desktopStyle: width,
      }),
      "--column-margin-left-tablet": getTabletStyle({
        stackedStyle: mobileMarginLeft,
        desktopStyle: gutterPixels,
      }),
    } as Dictionary<string>;
  }

  function getWidthForBreakpointSize(size: SizeName) {
    const breakpointSizes = getSizesForBreakpoints(
      props.builderContext.content?.meta?.breakpoints || {}
    );
    return breakpointSizes[size].max;
  }

  function columnsStyles() {
    return `
        @media (max-width: ${getWidthForBreakpointSize("medium")}px) {
          .${props.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${props.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${getWidthForBreakpointSize("small")}px) {
          .${props.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir);
            align-items: stretch;
          }

          .${props.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-mobile) !important;
            margin-left: var(--column-margin-left-mobile) !important;
          }
        },
      `;
  }

  return (
    <>
      <div
        className={
          `builder-columns ${props.builderBlock.id}-breakpoints` +
          " div-a6ce8b7c"
        }
        style={columnsCssVars()}
        {...{}}
      >
        {TARGET !== "reactNative" ? (
          <InlinedStyles id="builderio-columns" styles={columnsStyles()} />
        ) : null}
        {props.columns?.map((column, index) => (
          <DynamicRenderer
            key={index}
            TagName={column.link ? props.builderLinkComponent || "a" : "div"}
            actionAttributes={{}}
            attributes={{
              ...{},
              ...(column.link
                ? {
                    href: column.link,
                  }
                : {}),
              [getClassPropName()]: "builder-column",
              style: mapStyleObjToStrIfNeeded(columnCssVars(index)),
            }}
          >
            <Blocks
              path={`component.options.columns.${index}.blocks`}
              parent={props.builderBlock.id}
              styleProp={{
                flexGrow: "1",
              }}
              context={props.builderContext}
              registeredComponents={props.builderComponents}
              linkComponent={props.builderLinkComponent}
              blocks={column.blocks}
            />
          </DynamicRenderer>
        ))}
      </div>

      <style>{`.div-a6ce8b7c {
  display: flex;
  line-height: normal;
}`}</style>
    </>
  );
}

export default Columns;
