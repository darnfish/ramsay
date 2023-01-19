import { AnyAction } from 'redux';
export declare type TSObjectKey = string | number | symbol;
export declare type RamsayState<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T = O[I]> = {
    [key in I]: O;
};
export interface RamsayAction<O> extends AnyAction {
    options: RamsayTransformOptions<O>;
}
declare type RamsayReducer<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T = O[I]> = (state: RamsayState<O, I>, action: RamsayAction<O>) => RamsayState<O, I>;
export interface RamsayTransformOptions<O> {
    mapObject?: (object: O, index?: number) => any;
    mergeBaseState?: boolean;
    mergeObjectState?: boolean;
}
export interface RamsayPluralOverride {
    plural?: string;
    singular?: string;
}
interface RamsayOptions<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T = O[I]> {
    idKey?: TSObjectKey;
    plurals?: RamsayPluralOverride;
    extendReducers?: RamsayReducer<O, I>;
}
export default class Ramsay<O extends {
    [key in I]: T;
}, I extends TSObjectKey = 'id', T = O[I]> {
    modelName: string;
    idKey?: TSObjectKey;
    extendReducers?: RamsayReducer<O, I>;
    pluralOverride?: string;
    singularOverride?: string;
    constructor(modelName: string, options?: RamsayOptions<O, I>);
    update(object: O, options?: RamsayTransformOptions<O>): {
        [x: string]: string | O | RamsayTransformOptions<O>;
        type: string;
        options: RamsayTransformOptions<O>;
    };
    createUpdateMethod(): (object: O, options?: RamsayTransformOptions<O>) => {
        [x: string]: string | O | RamsayTransformOptions<O>;
        type: string;
        options: RamsayTransformOptions<O>;
    };
    updateMany(objects: O[], options?: RamsayTransformOptions<O>): {
        [x: string]: string | RamsayTransformOptions<O> | O[];
        type: string;
        options: RamsayTransformOptions<O>;
    };
    createUpdateManyMethod(): (objects: O[], options?: RamsayTransformOptions<O>) => {
        [x: string]: string | RamsayTransformOptions<O> | O[];
        type: string;
        options: RamsayTransformOptions<O>;
    };
    remove(objectId: string): {
        [x: string]: string;
        type: string;
    };
    createRemoveMethod(): (objectId: string) => {
        [x: string]: string;
        type: string;
    };
    removeMany(objectIds: string[]): {
        [x: string]: string | string[];
        type: string;
    };
    createRemoveManyMethod(): (objectIds: string[]) => {
        [x: string]: string | string[];
        type: string;
    };
    createReducer(): (state: RamsayState<O, I, O[I]>, action: RamsayAction<O>) => RamsayState<O, I, O[I]>;
    private get singularObjectName();
    private get pluralObjectName();
    private get actionTypeName();
}
export {};
