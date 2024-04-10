import type { CanTrack } from '../types/can-track.js';
import type { Nullable } from './nullable.js';
export declare const getLocalStorageItem: ({ key, canTrack }: {
    key: string;
} & CanTrack) => Nullable<string>;
export declare const setLocalStorageItem: ({ key, canTrack, value }: {
    key: string;
    value: string;
} & CanTrack) => void;
