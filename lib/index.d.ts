import { AnyAction } from 'redux';
export declare type TSObjectKey = string | number | symbol;
export declare type RamsayState<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T extends string | number | symbol = O[I]> = {
    [key in T]: O;
};
export interface RamsayAction<O> extends AnyAction {
    options: RamsayTransformOptions<O>;
}
declare type RamsayReducer<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T extends string | number | symbol = O[I]> = (state: RamsayState<O, I>, action: RamsayAction<O>, prefix?: string) => RamsayState<O, I>;
export interface RamsayTransformOptions<O> {
    mapObject?: (object: O, index?: number) => any;
    mergeBaseState?: boolean;
    mergeObjectState?: boolean;
}
interface RamsayOptions<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T extends string | number | symbol = O[I]> {
    idKey?: TSObjectKey;
    disableResetAction?: boolean;
}
export default class Ramsay<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T extends string | number | symbol = O[I]> {
    modelName: string;
    idKey?: TSObjectKey;
    disableResetAction?: boolean;
    pluralOverride?: string;
    singularOverride?: string;
    constructor(modelName: string, options?: RamsayOptions<O, I>);
    update(object: O, options?: RamsayTransformOptions<O>): {
        type: string;
        object: O;
        options: RamsayTransformOptions<O>;
    };
    createUpdateMethod(defaultOptions?: RamsayTransformOptions<O>): (object: O, options?: RamsayTransformOptions<O>) => {
        type: string;
        object: O;
        options: RamsayTransformOptions<O>;
    };
    updateMany(objects: O[], options?: RamsayTransformOptions<O>): {
        type: string;
        objects: O[];
        options: RamsayTransformOptions<O>;
    };
    createUpdateManyMethod(defaultOptions?: RamsayTransformOptions<O>): (objects: O[], options?: RamsayTransformOptions<O>) => {
        type: string;
        objects: O[];
        options: RamsayTransformOptions<O>;
    };
    remove(objectId: string): {
        type: string;
        objectId: string;
    };
    createRemoveMethod(): (objectId: string) => {
        type: string;
        objectId: string;
    };
    removeMany(objectIds: string[]): {
        type: string;
        objectIds: string[];
    };
    createRemoveManyMethod(): (objectIds: string[]) => {
        type: string;
        objectIds: string[];
    };
    withState(state: RamsayState<O, I>): {
        manuallyUpdateObject: (id: T, updateFn: (object?: O) => Partial<O>) => RamsayState<O, I, O[I]>;
        manuallyUpdateAllObjects: (updateFn: (object: O) => Partial<O>) => RamsayState<O, I, O[I]>;
    };
    createReducer(extend?: RamsayReducer<O, I>): (state: RamsayState<O, I, O[I]>, action: RamsayAction<O>) => RamsayState<O, I, O[I]>;
    private get actionTypeName();
}
export {};
