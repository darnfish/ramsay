"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = require("pluralize");
class Ramsay {
    constructor(modelName, extendReducers, plurals) {
        this.modelName = modelName;
        this.extendReducers = extendReducers;
        if (plurals) {
            this.pluralOverride = plurals.plural;
            this.singularOverride = plurals.singular;
        }
    }
    update(object, options = {}) {
        return {
            type: `${this.actionTypeName}/HANDLE`,
            [this.singularObjectName]: object,
            options
        };
    }
    createOneMethod() {
        return (object, options = {}) => this.update(object, options);
    }
    updateMany(objects, options = {}) {
        return {
            type: `${this.actionTypeName}/HANDLE_MANY`,
            [this.pluralObjectName]: objects,
            options
        };
    }
    createManyMethod() {
        return (objects, options = {}) => this.updateMany(objects, options);
    }
    remove(objectId) {
        return {
            type: `${this.actionTypeName}/REMOVE`,
            [`${this.pluralObjectName}Id`]: objectId
        };
    }
    createRemoveMethod() {
        return (objectId) => this.remove(objectId);
    }
    removeMany(objectIds) {
        return {
            type: `${this.actionTypeName}/REMOVE_MANY`,
            [`${this.pluralObjectName}Ids`]: objectIds
        };
    }
    createRemoveManyMethod() {
        return (objectIds) => this.removeMany(objectIds);
    }
    createReducer() {
        const BASE_STATE = {};
        const update = (_object, options, state) => {
            const mergeBaseState = (options === null || options === void 0 ? void 0 : options.mergeBaseState) !== false;
            const mergeObjectState = (options === null || options === void 0 ? void 0 : options.mergeObjectState) !== false;
            const oldObject = mergeObjectState ? state[_object.id] : null;
            if (oldObject)
                return Object.assign(Object.assign({}, state), { [_object.id]: Object.assign(Object.assign({}, oldObject), _object) });
            return Object.assign(Object.assign({}, (mergeBaseState ? state : BASE_STATE)), { [_object.id]: _object });
        };
        const updateMany = (_objects, options, state) => {
            const mergeBaseState = (options === null || options === void 0 ? void 0 : options.mergeBaseState) !== false;
            const mergeObjectState = (options === null || options === void 0 ? void 0 : options.mergeObjectState) !== false;
            const objects = Object.assign({}, BASE_STATE);
            _objects.forEach(object => {
                const oldInstitution = mergeObjectState ? state[object.id] : null;
                if (oldInstitution)
                    return objects[object.id] = Object.assign(Object.assign({}, oldInstitution), object);
                objects[object.id] = object;
            });
            return Object.assign(Object.assign({}, (mergeBaseState ? state : BASE_STATE)), objects);
        };
        const remove = (id, state) => {
            const newState = Object.assign({}, state);
            delete newState[id];
            return newState;
        };
        const removeMany = (ids, state) => {
            const newState = Object.assign({}, state);
            for (const id of ids)
                delete newState[id];
            return newState;
        };
        return (state = BASE_STATE, action) => {
            switch (action.type) {
                case 'RESET':
                    return BASE_STATE;
                case `${this.actionTypeName}/HANDLE`:
                    return update(action[this.singularObjectName], action.options, state);
                case `${this.actionTypeName}/HANDLE_MANY`:
                    return updateMany(action[this.pluralObjectName], action.options, state);
                case `${this.actionTypeName}/REMOVE`:
                    return remove(action[`${this.pluralObjectName}Id`], state);
                case `${this.actionTypeName}/REMOVE_MANY`:
                    return removeMany(action[`${this.pluralObjectName}Ids`], state);
                default:
                    if (this.extendReducers)
                        return this.extendReducers(state, action);
                    return state;
            }
        };
    }
    get singularObjectName() {
        return this.singularOverride || (0, pluralize_1.singular)(this.modelName);
    }
    get pluralObjectName() {
        return this.pluralOverride || (0, pluralize_1.plural)(this.modelName);
    }
    get actionTypeName() {
        return this.singularObjectName.toUpperCase();
    }
}
exports.default = Ramsay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5Q0FBNEM7QUF3QjVDLE1BQXFCLE1BQU07SUFPMUIsWUFBWSxTQUFpQixFQUFFLGNBQW9DLEVBQUUsT0FBOEI7UUFDbEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUE7UUFFcEMsSUFBRyxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7WUFDcEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7U0FDeEM7SUFDRixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVMsRUFBRSxVQUFrQyxFQUFFO1FBQ3JELE9BQU87WUFDTixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxTQUFTO1lBQ3JDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsTUFBTTtZQUNqQyxPQUFPO1NBQ1AsQ0FBQTtJQUNGLENBQUM7SUFFRCxlQUFlO1FBQ2QsT0FBTyxDQUFDLE1BQVMsRUFBRSxVQUFrQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3pGLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBWSxFQUFFLFVBQWtDLEVBQUU7UUFDNUQsT0FBTztZQUNOLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLGNBQWM7WUFDMUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxPQUFPO1lBQ2hDLE9BQU87U0FDUCxDQUFBO0lBQ0YsQ0FBQztJQUVELGdCQUFnQjtRQUNmLE9BQU8sQ0FBQyxPQUFZLEVBQUUsVUFBa0MsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8s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