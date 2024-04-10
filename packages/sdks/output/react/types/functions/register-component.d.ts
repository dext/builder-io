import type { ComponentInfo } from '../types/components.js';
export declare const createRegisterComponentMessage: (info: ComponentInfo) => {
    type: string;
    data: ComponentInfo;
};
export declare const serializeComponentInfo: ({ inputs, ...info }: ComponentInfo) => ComponentInfo;
