"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ramsay {
    constructor(modelName, options = {}) {
        this.modelName = modelName;
        this.idKey = (options === null || options === void 0 ? void 0 : options.idKey) || 'id';
        this.disableResetAction = (options === null || options === void 0 ? void 0 : options.disableResetAction) || false;
    }
    update(object, options = {}) {
        if (options.mapObject)
            object = options.mapObject(object);
        return {
            type: `${this.actionTypeName}/HANDLE`,
            object,
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
            objects,
            options
        };
    }
    createUpdateManyMethod(defaultOptions = {}) {
        return (objects, options = {}) => this.updateMany(objects, Object.assign(Object.assign({}, defaultOptions), options));
    }
    remove(objectId) {
        return {
            type: `${this.actionTypeName}/REMOVE`,
            objectId
        };
    }
    createRemoveMethod() {
        return (objectId) => this.remove(objectId);
    }
    removeMany(objectIds) {
        return {
            type: `${this.actionTypeName}/REMOVE_MANY`,
            objectIds
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
            return Object.assign(Object.assign({}, (mergeBaseState ? state : BASE_STATE)), { [_object[this.idKey]]: Object.assign(Object.assign({}, (oldObject ? oldObject : {})), _object) });
        };
        const updateMany = (_objects, options, state) => {
            const mergeBaseState = (options === null || options === void 0 ? void 0 : options.mergeBaseState) !== false;
            const mergeObjectState = (options === null || options === void 0 ? void 0 : options.mergeObjectState) !== false;
            const objects = Object.assign({}, (mergeBaseState ? state : BASE_STATE));
            for (const object of _objects) {
                const oldInstitution = mergeObjectState ? state[object[this.idKey]] : null;
                if (oldInstitution) {
                    objects[object[this.idKey]] = Object.assign(Object.assign({}, oldInstitution), object);
                    continue;
                }
                objects[object[this.idKey]] = object;
            }
            return objects;
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
                    return update(action.object, action.options, state);
                case `${this.actionTypeName}/HANDLE_MANY`:
                    return updateMany(action.objects, action.options, state);
                case `${this.actionTypeName}/REMOVE`:
                    return remove(action.objectId, state);
                case `${this.actionTypeName}/REMOVE_MANY`:
                    return removeMany(action.objectIds, state);
                default:
                    if (extend)
                        return extend(state, action, this.actionTypeName) || state;
                    return state;
            }
        };
    }
    get actionTypeName() {
        return this.modelName.toUpperCase();
    }
}
exports.default = Ramsay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUEwQkEsTUFBcUIsTUFBTTtJQVMxQixZQUFZLFNBQWlCLEVBQUUsVUFBK0IsRUFBRTtRQUMvRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUUxQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEtBQUssS0FBSSxJQUFJLENBQUE7UUFDbkMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLGtCQUFrQixLQUFJLEtBQUssQ0FBQTtJQUMvRCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVMsRUFBRSxVQUFxQyxFQUFFO1FBQ3hELElBQUcsT0FBTyxDQUFDLFNBQVM7WUFDbkIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFbkMsT0FBTztZQUNOLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLFNBQVM7WUFDckMsTUFBTTtZQUNOLE9BQU87U0FDUCxDQUFBO0lBQ0YsQ0FBQztJQUVELGtCQUFrQixDQUFDLGlCQUE0QyxFQUFFO1FBQ2hFLE9BQU8sQ0FBQyxNQUFTLEVBQUUsVUFBcUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sa0NBQU8sY0FBYyxHQUFLLE9BQU8sRUFBRyxDQUFBO0lBQ3RILENBQUM7SUFFRCxVQUFVLENBQUMsT0FBWSxFQUFFLFVBQXFDLEVBQUU7UUFDL0QsSUFBRyxPQUFPLENBQUMsU0FBUztZQUNuQixPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFekMsT0FBTztZQUNOLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLGNBQWM7WUFDMUMs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