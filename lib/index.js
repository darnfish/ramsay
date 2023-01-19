"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = require("pluralize");
class Ramsay {
    constructor(modelName, options = {}) {
        this.modelName = modelName;
        this.idKey = (options === null || options === void 0 ? void 0 : options.idKey) || 'id';
        this.extendReducers = options === null || options === void 0 ? void 0 : options.extendReducers;
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
    createUpdateMethod() {
        return (object, options = {}) => this.update(object, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5Q0FBNEM7QUFpQzVDLE1BQXFCLE1BQU07SUFTMUIsWUFBWSxTQUFpQixFQUFFLFVBQStCLEVBQUU7UUFDL0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7UUFFMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxLQUFLLEtBQUksSUFBSSxDQUFBO1FBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLGNBQWMsQ0FBQTtRQUU3QyxJQUFHLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxPQUFPLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQTtZQUM1QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUE7U0FDaEQ7SUFDRixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVMsRUFBRSxVQUFxQyxFQUFFO1FBQ3hELElBQUcsT0FBTyxDQUFDLFNBQVM7WUFDbkIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFbkMsT0FBTztZQUNOLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLFNBQVM7WUFDckMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxNQUFNO1lBQ2pDLE9BQU87U0FDUCxDQUFBO0lBQ0YsQ0FBQztJQUVELGtCQUFrQjtRQUNqQixPQUFPLENBQUMsTUFBUyxFQUFFLFVBQXFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDNUYsQ0FBQztJQUVELFVBQVUs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