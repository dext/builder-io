type Offset = {
    x: number;
    y: number;
};
export declare const getInteractionPropertiesForEvent: (event: MouseEvent) => {
    targetBuilderElement: string;
    metadata: {
        targetOffset: Offset;
        builderTargetOffset: Offset;
        builderElementIndex: any;
    };
};
export {};
