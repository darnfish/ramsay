import { AnyAction } from 'redux'
import { plural, singular } from 'pluralize'

export type RamsayId = string | number | symbol

export type RamsayState<O, I extends RamsayId> = {
	[key in I]: O
}

export interface RamsayAction extends AnyAction {
	options: RamsayTransformOptions
}

type RamsayReducer<O, I extends RamsayId> = (state: RamsayState<O, I>, action: RamsayAction) => RamsayState<O, I>

export interface RamsayTransformOptions {
  mergeBaseState?: boolean
  mergeObjectState?: boolean
}

export interface RamsayPluralOverride {
	plural?: string
	singular?: string
}

export default class Ramsay<O extends { id: I }, I extends RamsayId> {
	modelName: string
	extendReducers?: RamsayReducer<O, I>

	pluralOverride?: string
	singularOverride?: string
	
	constructor(modelName: string, extendReducers?: RamsayReducer<O, I>, plurals?: RamsayPluralOverride) {
		this.modelName = modelName
		this.extendReducers = extendReducers

		if(plurals) {
			this.pluralOverride = plurals.plural
			this.singularOverride = plurals.singular
		}
	}

	update(object: O, options: RamsayTransformOptions = {}) {
		return {
			type: `${this.actionTypeName}/HANDLE`,
			[this.singularObjectName]: object,
			options
		}
	}

	createOneMethod() {
		return (object: O, options: RamsayTransformOptions = {}) => this.update(object, options)
	}

	updateMany(objects: O[], options: RamsayTransformOptions = {}) {
		return {
			type: `${this.actionTypeName}/HANDLE_MANY`,
			[this.pluralObjectName]: objects,
			options
		}
	}

	createManyMethod() {
		return (objects: O[], options: RamsayTransformOptions = {}) => this.updateMany(objects, options)
	}

	remove(objectId: string) {
		return {
			type: `${this.actionTypeName}/REMOVE`,
			[`${this.pluralObjectName}Id`]: objectId
		}
	}

	createRemoveMethod() {
		return (objectId: string) => this.remove(objectId)
	}

	removeMany(objectIds: string[]) {
		return {
			type: `${this.actionTypeName}/REMOVE_MANY`,
			[`${this.pluralObjectName}Ids`]: objectIds
		}
	}

	createRemoveManyMethod() {
		return (objectIds: string[]) => this.removeMany(objectIds)
	}

	createReducer() {
		const BASE_STATE = {} as RamsayState<O, I>

		const update = (_object: O, options: RamsayTransformOptions, state: RamsayState<O, I>): RamsayState<O, I> => {
			const mergeBaseState = options?.mergeBaseState !== false
			const mergeObjectState = options?.mergeObjectState !== false

			const oldObject = mergeObjectState ? state[_object.id] : null
			if(oldObject)
				return {
					...state,
					[_object.id]: {
						...oldObject,
						..._object
					}
				}
		
			return {
				...(mergeBaseState ? state : BASE_STATE),
				[_object.id]: _object
			}
		}

		const updateMany = (_objects: O[], options: RamsayTransformOptions, state: RamsayState<O, I>): RamsayState<O, I> => {
			const mergeBaseState = options?.mergeBaseState !== false
			const mergeObjectState = options?.mergeObjectState !== false

			const objects = { ...BASE_STATE }
			_objects.forEach(object => {
				const oldInstitution = mergeObjectState ? state[object.id] : null
				if(oldInstitution)
					return objects[object.id] = {
						...oldInstitution,
						...object
					}
		
				objects[object.id] = object
			})
		
			return {
				...(mergeBaseState ? state : BASE_STATE),
				...objects
			}
		}

		const remove = (id: string, state: RamsayState<O, I>): RamsayState<O, I> => {
			const newState = { ...state }
			delete newState[id]

			return newState
		}

		const removeMany = (ids: string[], state: RamsayState<O, I>): RamsayState<O, I> => {
			const newState = { ...state }
			for(const id of ids)
				delete newState[id]

			return newState
		}

		return (state = BASE_STATE, action: RamsayAction) => {
			switch(action.type) {
			case 'RESET':
				return BASE_STATE
			case `${this.actionTypeName}/HANDLE`:
				return update(action[this.singularObjectName], action.options, state)
			case `${this.actionTypeName}/HANDLE_MANY`:
				return updateMany(action[this.pluralObjectName], action.options, state)
			case `${this.actionTypeName}/REMOVE`:
				return remove(action[`${this.pluralObjectName}Id`], state)
			case `${this.actionTypeName}/REMOVE_MANY`:
				return removeMany(action[`${this.pluralObjectName}Ids`], state)
			default:
				if(this.extendReducers)
					return this.extendReducers(state, action)

				return state
			}
		}
	}

	private get singularObjectName() {
		return this.singularOverride || singular(this.modelName)
	}

	private get pluralObjectName() {
		return this.pluralOverride || plural(this.modelName)
	}

	private get actionTypeName() {
		return this.singularObjectName.toUpperCase()
	}
}
