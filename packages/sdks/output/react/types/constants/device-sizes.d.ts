export type SizeName = 'large' | 'medium' | 'small';
interface Size {
    min: number;
    default: number;
    max: number;
}
export declare const getMaxWidthQueryForSize: (size: SizeName, sizeValues?: Record<SizeName, Size>) => string;
interface Breakpoints {
    small?: number;
    medium?: number;
}
export declare const getSizesForBreakpoints: ({ small, medium }: Breakpoints) => Record<SizeName, Size>;
export {};
