import type { BuilderBlock } from './builder-block.js';
import type { Input } from './input.js';
import type { Nullable } from './typescript.js';
export interface Breakpoints {
    small: number;
    medium: number;
}
export interface BuilderContentVariation {
    data?: {
        title?: string;
        blocks?: BuilderBlock[];
        inputs?: Input[];
        state?: {
            [key: string]: any;
        };
        jsCode?: string;
        tsCode?: string;
        httpRequests?: {
            [key: string]: string;
        };
        [key: string]: any;
    };
    name?: string;
    testRatio?: number;
    id?: string;
    meta?: {
        breakpoints?: Nullable<Breakpoints>;
        [key: string]: any;
    };
}
export interface BuilderContent extends BuilderContentVariation {
    '@version'?: number;
    published?: 'published' | 'draft' | 'archived';
    modelId?: string;
    priority?: number;
    lastUpdated?: number;
    startDate?: number;
    endDate?: number;
    variations?: {
        [id: string]: BuilderContentVariation;
    };
    testVariationId?: string;
    testVariationName?: string;
}
