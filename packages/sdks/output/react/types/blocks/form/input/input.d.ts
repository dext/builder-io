import * as React from "react";
/**
 * This import is used by the Svelte SDK. Do not remove.
 */
export interface FormInputProps {
    type?: string;
    attributes?: any;
    name?: string;
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
}
declare function FormInputComponent(props: FormInputProps): React.JSX.Element;
export default FormInputComponent;
