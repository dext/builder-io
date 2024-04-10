import type { BuilderContextInterface, BuilderRenderState } from '../../context/types.js';
import { getUserAttributes } from '../track/helpers.js';
export type EvaluatorArgs = Omit<ExecutorArgs, 'builder' | 'event'> & {
    event?: Event;
    isExpression?: boolean;
    enableCache: boolean;
};
export type BuilderGlobals = {
    isEditing: boolean | undefined;
    isBrowser: boolean | undefined;
    isServer: boolean | undefined;
    getUserAttributes: typeof getUserAttributes;
};
export type ExecutorArgs = Pick<BuilderContextInterface, 'localState' | 'context' | 'rootState' | 'rootSetState'> & {
    code: string;
    builder: BuilderGlobals;
    event: Event | undefined;
};
export type Executor = (args: ExecutorArgs) => any;
export type FunctionArguments = ReturnType<typeof getFunctionArguments>;
export declare const getFunctionArguments: ({ builder, context, event, state }: Pick<ExecutorArgs, "context" | "builder" | "event"> & {
    state: BuilderRenderState;
}) => [string, Event | BuilderRenderState | import("../../context/types.js").BuilderRenderContext | BuilderGlobals][];
export declare const getBuilderGlobals: () => BuilderGlobals;
export declare const parseCode: (code: string, { isExpression }: Pick<EvaluatorArgs, 'isExpression'>) => string;
