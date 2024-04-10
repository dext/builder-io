import type { BuilderContent } from '../../types/builder-content.js';
import type { Nullable } from '../../types/typescript.js';
import type { ContentProps } from './content.types.js';
export declare const getRootStateInitialValue: ({ content, data, locale }: Pick<ContentProps, 'content' | 'data' | 'locale'>) => {
    locale?: string;
};
export declare const getContentInitialValue: ({ content, data }: Pick<ContentProps, 'content' | 'data'>) => Nullable<BuilderContent>;
