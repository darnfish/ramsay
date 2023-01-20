"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = require("pluralize");
class Ramsay {
    constructor(modelName, options = {}) {
        this.modelName = modelName;
        this.idKey = (options === null || options === void 0 ? void 0 : options.idKey) || 'id';
        this.disableResetAction = (options === null || options === void 0 ? void 0 : options.disableResetAction) || false;
        if (options === null || options === void 0 ? void 0 : options.plurals) {
            this.pluralOverride = options.plurals.plural;
            this.singularOverride = options.plurals.singular;
        }
    }
    update(object, options = {}) {
        if (options.mapObject)
            object = options.mapObject(object);
        return {
            type: `${this.actionTypeName}/HANDLE`,
            [this.singularObjectName]: object,
            options
        };
    }
    createUpdateMethod(defaultOptions = {}) {
        return (object, options = {}) => this.update(object, Object.assign(Object.assign({}, defaultOptions), options));
    }
    updateMany(objects, options = {}) {
        if (options.mapObject)
            objects = objects.map(options.mapObject);
        return {
            type: `${this.actionTypeName}/HANDLE_MANY`,
            [this.pluralObjectName]: objects,
            options
        };
    }
    createUpdateManyMethod(defaultOptions = {}) {
        return (objects, options = {}) => this.updateMany(objects, Object.assign(Object.assign({}, defaultOptions), options));
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
    createReducer(extend) {
        const BASE_STATE = {};
        const update = (_object, options, state) => {
            const mergeBaseState = (options === null || options === void 0 ? void 0 : options.mergeBaseState) !== false;
            const mergeObjectState = (options === null || options === void 0 ? void 0 : options.mergeObjectState) !== false;
            const oldObject = mergeObjectState ? state[_object[this.idKey]] : null;
            if (oldObject)
                return Object.assign(Object.assign({}, state), { [_object[this.idKey]]: Object.assign(Object.assign({}, oldObject), _object) });
            return Object.assign(Object.assign({}, (mergeBaseState ? state : BASE_STATE)), { [_object[this.idKey]]: _object });
        };
        const updateMany = (_objects, options, state) => {
            const mergeBaseState = (options === null || options === void 0 ? void 0 : options.mergeBaseState) !== false;
            const mergeObjectState = (options === null || options === void 0 ? void 0 : options.mergeObjectState) !== false;
            const objects = Object.assign({}, BASE_STATE);
            _objects.forEach(object => {
                const oldInstitution = mergeObjectState ? state[object[this.idKey]] : null;
                if (oldInstitution)
                    return objects[object[this.idKey]] = Object.assign(Object.assign({}, oldInstitution), object);
                objects[object[this.idKey]] = object;
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
            if (!this.disableResetAction)
                switch (action.type) {
                    case 'RESET':
                        return BASE_STATE;
                    default:
                        break;
                }
            switch (action.type) {
                case `${this.actionTypeName}/HANDLE`:
                    return update(action[this.singularObjectName], action.options, state);
                case `${this.actionTypeName}/HANDLE_MANY`:
                    return updateMany(action[this.pluralObjectName], action.options, state);
                case `${this.actionTypeName}/REMOVE`:
                    return remove(action[`${this.pluralObjectName}Id`], state);
                case `${this.actionTypeName}/REMOVE_MANY`:
                    return removeMany(action[`${this.pluralObjectName}Ids`], state);
                default:
                    if (extend)
                        return extend(state, action, this.actionTypeName) || state;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5Q0FBNEM7QUFpQzVDLE1BQXFCLE1BQU07SUFTMUIsWUFBWSxTQUFpQixFQUFFLFVBQStCLEVBQUU7UUFDL0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7UUFFMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxLQUFLLEtBQUksSUFBSSxDQUFBO1FBQ25DLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxrQkFBa0IsS0FBSSxLQUFLLENBQUE7UUFFOUQsSUFBRyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsT0FBTyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUE7WUFDNUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFBO1NBQ2hEO0lBQ0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFTLEVBQUUsVUFBcUMsRUFBRTtRQUN4RCxJQUFHLE9BQU8sQ0FBQyxTQUFTO1lBQ25CLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRW5DLE9BQU87WUFDTixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxTQUFTO1lBQ3JDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsTUFBTTtZQUNqQyxPQUFPO1NBQ1AsQ0FBQTtJQUNGLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxpQkFBNEMsRUFBRTtRQUNoRSxPQUFPLENBQUMsTUFBUyxFQUFFLFVBQXFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLGtDQUFP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