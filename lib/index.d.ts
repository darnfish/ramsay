import { AnyAction } from 'redux';
export declare type RamsayId = string | number | symbol;
export declare type RamsayState<O, I extends RamsayId> = {
    [key in I]: O;
};
export interface RamsayAction extends AnyAction {
    options: RamsayTransformOptions;
}
declare type RamsayReducer<O, I extends RamsayId> = (state: RamsayState<O, I>, action: RamsayAction) => RamsayState<O, I>;
export interface RamsayTransformOptions {
    mergeBaseState?: boolean;
    mergeObjectState?: boolean;
}
export interface RamsayPluralOverride {
    plural?: string;
    singular?: string;
}
export default class Ramsay<O extends {
    id: I;
}, I extends RamsayId> {
    modelName: string;
    extendReducers?: RamsayReducer<O, I>;
    pluralOverride?: string;
    singularOverride?: string;
    constructor(modelName: string, extendReducers?: RamsayReducer<O, I>, plurals?: RamsayPluralOverride);
    update(object: O, options?: RamsayTransformOptions): {
        [x: string]: string | RamsayTransformOptions | O;
        type: string;
        options: RamsayTransformOptions;
    };
    createUpdateMethod(): (object: O, options?: RamsayTransformOptions) => {
        [x: string]: string | RamsayTransformOptions | O;
        type: string;
        options: RamsayTransformOptions;
    };
    updateMany(objects: O[], options?: RamsayTransformOptions): {
        [x: string]: string | RamsayTransformOptions | O[];
        type: string;
        options: RamsayTransformOptions;
    };
    createUpdateManyMethod(): (objects: O[], options?: RamsayTransformOptions) => {
        [x: string]: string | RamsayTransformOptions | O[];
        type: string;
        options: RamsayTransformOptions;
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
    createReducer(): (state: RamsayState<O, I>, action: RamsayAction) => RamsayState<O, I>;
    private get singularObjectName();
    private get pluralObjectName();
    private get actionTypeName();
}
export {};
