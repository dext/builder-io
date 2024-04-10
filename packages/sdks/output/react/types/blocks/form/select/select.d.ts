import * as React from "react";
/**
 * This import is used by the Svelte SDK. Do not remove.
 */
export interface FormSelectProps {
    options?: {
        name?: string;
        value: string;
    }[];
    attributes?: any;
    name?: string;
    value?: string;
    defaultValue?: string;
}
declare function SelectComponent(props: FormSelectProps): React.JSX.Element;
export default SelectComponent;
