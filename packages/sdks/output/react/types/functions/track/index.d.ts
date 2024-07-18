import type { CanTrack } from '../../types/can-track.js';
import type { Dictionary } from '../../types/typescript.js';
interface Event {
    /**
     * The type of your event.
     *
     * Examples: `click`, `conversion`, `pageview`, `impression`
     */
    type: string;
    data: {
        /**
         * (Optional) The content's ID. Useful if this event pertains to a specific piece of content.
         */
        contentId?: string;
        /**
         * This is the ID of the space that the content belongs to.
         */
        ownerId: string;
        /**
         * (Optional) metadata that you want to provide with your event.
         */
        metadata?: Dictionary<any>;
        /**
         * Session ID of the user. This is provided by the SDK by checking session storage.
         */
        sessionId: string | undefined;
        /**
         * Visitor ID of the user. This is provided by the SDK by checking cookies.
         */
        visitorId: string | undefined;
        /**
         * (Optional) If running an A/B test, the ID of the variation that the user is in.
         */
        variationId?: string;
        [index: string]: any;
    };
}
type EventProperties = Pick<Event, 'type'> & Pick<Event['data'], 'contentId' | 'variationId' | 'metadata'> & {
    /**
     * Your organization's API key.
     */
    apiKey: Event['data']['ownerId'];
    /**
     * (Optional) Any additional (non-metadata) properties to add to the event.
     */
    [index: string]: any;
};
export type EventProps = EventProperties & CanTrack;
export declare function _track(eventProps: EventProps): Promise<void | Response>;
export declare const track: (args: EventProperties) => Promise<void | Response>;
export {};
