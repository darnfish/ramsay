import { AnyAction } from 'redux'
import { plural, singular } from 'pluralize'

// Ramsay
export type TSObjectKey = string | number | symbol

export type RamsayState<O extends { [key in I]: T }, I extends TSObjectKey = 'id', T = O[I]> = {
	[key in I]: O
}

export interface RamsayAction<O> extends AnyAction {
	options: RamsayTransformOptions<O>
}

type RamsayReducer<O extends { [key in I]: T }, I extends TSObjectKey = 'id', T = O[I]> = (state: RamsayState<O, I>, action: RamsayAction<O>, prefix?: string) => RamsayState<O, I>

export interface RamsayTransformOptions<O> {
	mapObject?: (object: O, index?: number) => any
  mergeBaseState?: boolean
  mergeObjectState?: boolean
}

export interface RamsayPluralOverride {
	plural?: string
	singular?: string
}

interface RamsayOptions<O extends { [key in I]: T }, I extends TSObjectKey = 'id', T = O[I]>{
	idKey?: TSObjectKey
	disableResetAction?: boolean

	plurals?: RamsayPluralOverride
}

export default class Ramsay<O extends { [key in I]: T }, I extends TSObjectKey = 'id', T = O[I]> {
	modelName: string
	
	idKey?: TSObjectKey
	disableResetAction?: boolean

	pluralOverride?: string
	singularOverride?: string
	
	constructor(modelName: string, options: RamsayOptions<O, I> = {}) {
		this.modelName = modelName

		this.idKey = options?.idKey || 'id'
		this.disableResetAction = options?.disableResetAction || false

		if(options?.plurals) {
			this.pluralOverride = options.plurals.plural
			this.singularOverride = options.plurals.singular
		}
	}

	update(object: O, options: RamsayTransformOptions<O> = {}) {
		if(options.mapObject)
			object = options.mapObject(object)

		return {
			type: `${this.actionTypeName}/HANDLE`,
			[this.singularObjectName]: object,
			options
		}
	}

	createUpdateMethod(defaultOptions: RamsayTransformOptions<O> = {}) {
		return (object: O, options: RamsayTransformOptions<O> = {}) => this.update(object, { ...defaultOptions, ...options })
	}

	updateMany(objects: O[], options: RamsayTransformOptions<O> = {}) {
		if(options.mapObject)
			objects = objects.map(options.mapObject)

		return {
			type: `${this.actionTypeName}/HANDLE_MANY`,
			[this.pluralObjectName]: objects,
			options
		}
	}

	createUpdateManyMethod(defaultOptions: RamsayTransformOptions<O> = {}) {
		return (objects: O[], options: RamsayTransformOptions<O> = {}) => this.updateMany(objects, { ...defaultOptions, ...options })
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

	createReducer(extend?: RamsayReducer<O, I>) {
		const BASE_STATE = {} as RamsayState<O, I>

		const update = (_object: O, options: RamsayTransformOptions<O>, state: RamsayState<O, I>): RamsayState<O, I> => {
			const mergeBaseState = options?.mergeBaseState !== false
			const mergeObjectState = options?.mergeObjectState !== false

			const oldObject = mergeObjectState ? state[_object[this.idKey]] : null
			if(oldObject)
				return {
					...state,
					[_object[this.idKey]]: {
						...oldObject,
						..._object
					}
				}
		
			return {
				...(mergeBaseState ? state : BASE_STATE),
				[_object[this.idKey]]: _object
			}
		}

		const updateMany = (_objects: O[], options: RamsayTransformOptions<O>, state: RamsayState<O, I>): RamsayState<O, I> => {
			const mergeBaseState = options?.mergeBaseState !== false
			const mergeObjectState = options?.mergeObjectState !== false

			const objects = { ...BASE_STATE }
			_objects.forEach(object => {
				const oldInstitution = mergeObjectState ? state[object[this.idKey]] : null
				if(oldInstitution)
					return objects[object[this.idKey]] = {
						...oldInstitution,
						...object
					}
		
				objects[object[this.idKey]] = object
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

		return (state = BASE_STATE, action: RamsayAction<O>) => {
			if(!this.disableResetAction)
				switch(action.type) {
				case 'RESET':
					return BASE_STATE
				default:
					break
				}

			switch(action.type) {
			case `${this.actionTypeName}/HANDLE`:
				return update(action[this.singularObjectName], action.options, state)
			case `${this.actionTypeName}/HANDLE_MANY`:
				return updateMany(action[this.pluralObjectName], action.options, state)
			case `${this.actionTypeName}/REMOVE`:
				return remove(action[`${this.pluralObjectName}Id`], state)
			case `${this.actionTypeName}/REMOVE_MANY`:
				return removeMany(action[`${this.pluralObjectName}Ids`], state)
			default:
				if(extend)
					return extend(state, action, this.actionTypeName) || state

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
