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
    withState(state) {
        return {
            manuallyUpdateObject: (id, updateFn) => {
                // Find existing object
                const existingObject = state[id.toString()] ? Object.assign({}, state[id.toString()]) : null;
                if (!existingObject)
                    return state;
                // Update object
                const updatedObject = updateFn(existingObject);
                if (!updatedObject)
                    return state;
                return Object.assign(Object.assign({}, state), { [id]: Object.assign(Object.assign({}, existingObject), updatedObject) });
            },
            manuallyUpdateAllObjects: (updateFn) => {
                const allObjects = Object.values(state);
                const updatedObjects = {};
                for (const object of allObjects) {
                    const updatedObject = updateFn(object);
                    if (!updatedObject)
                        continue;
                    const objectId = object[this.idKey];
                    updatedObjects[objectId] = Object.assign(Object.assign({}, object), updatedObject);
                }
                return Object.assign(Object.assign({}, state), updatedObjects);
            }
        };
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