import type { BuilderContent } from '../../types/builder-content.js';
export declare function postPreviewContent({ key, value }: {
    key: string;
    value: BuilderContent;
}): Promise<{
    [x: string]: BuilderContent;
}>;
