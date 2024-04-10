import type { BuilderContent } from '../types/builder-content.js';
import type { CanTrack } from '../types/can-track.js';
import type { Nullable } from '../types/typescript.js';
export declare const handleABTestingSync: ({ item, canTrack }: {
    item: Nullable<BuilderContent>;
} & CanTrack) => Nullable<BuilderContent>;
export declare const handleABTesting: ({ item, canTrack }: {
    item: BuilderContent;
} & CanTrack) => Promise<BuilderContent>;
