import * as React from "react";

interface Props {
  styles: string;
  id: string;
}

function InlinedStyles(props: Props) {
  return (
    <style
      dangerouslySetInnerHTML={{ __html: props.styles }}
      data-id={props.id}
    />
  );
}

export default InlinedStyles;
