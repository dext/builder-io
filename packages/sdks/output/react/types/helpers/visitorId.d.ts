import type { CanTrack } from '../types/can-track.js';
export declare const getVisitorId: ({ canTrack }: CanTrack) => string | undefined;
export declare const createVisitorId: () => string;
export declare const setVisitorId: ({ id, canTrack }: {
    id: string;
} & CanTrack) => void;
