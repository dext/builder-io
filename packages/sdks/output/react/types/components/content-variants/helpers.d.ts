import type { Nullable } from '../../helpers/nullable.js';
import type { BuilderContent } from '../../types/builder-content.js';
export declare const getVariants: (content: Nullable<BuilderContent>) => {
    testVariationId: string;
    id: string;
    data?: {
        [key: string]: any;
        title?: string;
        blocks?: import("../../server-index.js").BuilderBlock[];
        inputs?: import("../../types/input.js").Input[];
        state?: {
            [key: string]: any;
        };
        jsCode?: string;
        tsCode?: string;
        httpRequests?: {
            [key: string]: string;
        };
    };
    name?: string;
    testRatio?: number;
    meta?: {
        [key: string]: any;
        breakpoints?: import("../../types/builder-content.js").Breakpoints;
    };
}[];
export declare const checkShouldRenderVariants: ({ canTrack, content }: {
    canTrack: Nullable<boolean>;
    content: Nullable<BuilderContent>;
}) => boolean;
type VariantData = {
    id: string;
    testRatio?: number;
};
export declare const getInitVariantsFnsScriptString: () => string;
export declare const getUpdateCookieAndStylesScript: (variants: VariantData[], contentId: string) => string;
export declare const getUpdateVariantVisibilityScript: ({ contentId, variationId }: {
    variationId: string;
    contentId: string;
}) => string;
export {};
