import * as React from "react";
/**
 * This import is used by the Svelte SDK. Do not remove.
 */
export type FormProps = BuilderDataProps & BuilderComponentsProp & BuilderLinkComponentProp & {
    attributes?: any;
    name?: string;
    action?: string;
    validate?: boolean;
    method?: string;
    sendSubmissionsTo?: string;
    sendSubmissionsToEmail?: string;
    sendWithJs?: boolean;
    contentType?: string;
    customHeaders?: {
        [key: string]: string;
    };
    successUrl?: string;
    previewState?: FormState;
    successMessage?: BuilderBlock[];
    errorMessage?: BuilderBlock[];
    sendingMessage?: BuilderBlock[];
    resetFormOnSubmit?: boolean;
    errorMessagePath?: string;
};
/**
 * This import is used by the Svelte SDK. Do not remove.
 */
export type FormState = "unsubmitted" | "sending" | "success" | "error";
import type { BuilderBlock } from "../../../types/builder-block.js";
import type { BuilderComponentsProp, BuilderDataProps, BuilderLinkComponentProp } from "../../../types/builder-props.js";
declare function FormComponent(props: FormProps): React.JSX.Element;
export default FormComponent;
