import type { ContentProps } from '../components/content/content.types.js';
import type { BuilderAnimation } from '../types/builder-block.js';
import type { BuilderContent } from '../types/builder-content.js';
type ContentListener = Required<Pick<ContentProps, 'model' | 'trustedHosts'>> & {
    callbacks: {
        contentUpdate: (updatedContent: BuilderContent) => void;
        animation: (updatedContent: BuilderAnimation) => void;
        configureSdk: (updatedContent: any) => void;
    };
};
export declare const createEditorListener: ({ model, trustedHosts, callbacks }: ContentListener) => (event: MessageEvent<any>) => void;
type SubscribeToEditor = (
/**
 * The Builder `model` to subscribe to
 */
model: string, 
/**
 * The callback function to call when the content is updated.
 */
callback: (updatedContent: BuilderContent) => void, 
/**
 * Extra options for the listener.
 */
options?: {
    /**
     * List of hosts to allow editing content from.
     */
    trustedHosts?: string[] | undefined;
}) => () => void;
/**
 * Subscribes to the Builder editor and listens to `content` updates of a certain `model`.
 * Sends the updated `content` to the `callback` function.
 */
export declare const subscribeToEditor: SubscribeToEditor;
export {};
