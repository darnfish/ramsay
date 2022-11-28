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
    createUpdateMethod() {
        return (object, options = {}) => this.update(object, options);
    }
    updateMany(objects, options = {}) {
        return {
            type: `${this.actionTypeName}/HANDLE_MANY`,
            [this.pluralObjectName]: objects,
            options
        };
    }
    createUpdateManyMethod() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5Q0FBNEM7QUF3QjVDLE1BQXFCLE1BQU07SUFPMUIsWUFBWSxTQUFpQixFQUFFLGNBQW9DLEVBQUUsT0FBOEI7UUFDbEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUE7UUFFcEMsSUFBRyxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7WUFDcEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7U0FDeEM7SUFDRixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVMsRUFBRSxVQUFrQyxFQUFFO1FBQ3JELE9BQU87WUFDTixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxTQUFTO1lBQ3JDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsTUFBTTtZQUNqQyxPQUFPO1NBQ1AsQ0FBQTtJQUNGLENBQUM7SUFFRCxrQkFBa0I7UUFDakIsT0FBTyxDQUFDLE1BQVMsRUFBRSxVQUFrQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3pGLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBWSxFQUFFLFVBQWtDLEVBQUU7UUFDNUQsT0FBTztZQUNOLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLGNBQWM7WUFDMUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxPQUFPO1lBQ2hDLE9BQU87U0FDUCxDQUFBO0lBQ0YsQ0FBQztJQUVELHNCQUFzQjtRQUNyQixPQUFPLENBQUMsT0FBWSxFQUFFLFVBQWtDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxP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