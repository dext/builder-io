import type { CanTrack } from '../types/can-track.js';
export declare const getSessionId: ({ canTrack }: CanTrack) => Promise<string | undefined>;
export declare const createSessionId: () => string;
export declare const setSessionId: ({ id, canTrack }: {
    id: string;
} & CanTrack) => Promise<void>;
