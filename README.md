# Ramsay
Simple API for Redux Reducers.

If your Redux store looks like `store.users[id] = userObject`, then Ramsay is for you.

## Installation
```
yarn add ramsay
```

## Usage
```tsx
import Ramsay from 'ramsay'

interface User {
	id: string
	name: string
}

const users = new Ramsay<User>('users') // for non-TS users: const users = new Ramsay('users')

/**
 * If you have a different field for your object id, or a different type (default is string):
 * new Ramsay<{ _id: number }, '_id'>('users', { idKey: '_id' })
 **/

// This is your reducer
const reducer = users.createReducer()
const { store, dispatch } = configureStore({ reducer })

// This is how you add/update a single object
dispatch(users.update({ id: 1, name: 'William' }))

console.log(store) // { 1: { id: 1, name: 'William' } }

// This is how you add/update multiple objects
dispatch(users.updateMany([{ id: 2, name: 'Walter' }, { id: 3, name: 'Jesse' }]))

console.log(store) // { 1: { id: 1, name: 'William' }, 2: { id: 2, name: 'Walter' }, 3: { id: 3, name: 'Jesse' } }

// This is how you remove a single object
dispatch(users.remove(1))

console.log(store) // { 2: { id: 2, name: 'Walter' }, 3: { id: 3, name: 'Jesse' } }

// This is how you remove multiple objects
dispatch(users.removeMany([2, 3]))

console.log(store) // {}
```

### Custom Id Field and/or Type
You can customize which field Ramsay will use for indexing, in addition to the type of that field.

By default, Ramsay will scan for `id` on your object and assume it is a string.

To change this, adjust the following:
```ts
import Ramsay from 'ramsay'

interface User {
	_id: number
	name: string
}

const users = new Ramsay<User, '_id'>('users', { idKey: '_id' })
// for non-TS users: const users = new Ramsay('users', { idKey: '_id' })
```

If you're using TypeScript, Ramsay will automatically pick up the type of your id key field.

### Extending Reducers
You can add your own custom actions ontop of Ramsay using `extend` parameter on the `createReducer` method:
```ts
const reducer = users.createReducer((state, action, prefix) => {
	switch(action.type) {
	case `${PREFIX}/CUSTOM_ACTION`:
		return users.withState(state).manuallyUpdateObject(action.userId, oldUser => ({ counter: oldUser.counter + 1 }))
	}
})
```

These additional actions will not take priority over Ramsay's built-in reducers for `update`, `updateMany`, `remove`, and `removeMany`.

### Dispatch Functions
Ramsay can create custom dispatch functions which you can use to avoid importing your reducer. See below:
```ts
const users = new Ramsay('users')

const updateUser = users.createUpdateMethod()

updateUser({ id: 1, name: 'William' })
```

You can also pass in a default set of options into this create method. They will not take priority over any options declared inside the generated method.

```ts
const updateUsers = users.createUpdateManyMethod({ mapObject: user => ({ ...user, customChange: 1 }) })

updateUsers([{ id: 1, name: 'William' }])

// { 1: { id: 1, name: 'William', customChange: 1 } }
```

### Plural and Singular Overrides
Ramsay attempts to figure out the singular and plural versions of your model name for internal use. For example:
```
users:
- singular: user
- plural: users

messages:
- singular: message
- plural: messages

eventEnrollments:
- singular: eventEnrollment
- plural: eventEnrollments
```

In some instances, Ramsay can't figure out a singular or plural version of your model name (for instance, `cash`).

You can provide your own custom singular/plural names in the options:
```ts
new Ramsay('cash', {
	plurals: {
		plural: 'cashes',
		singular: 'cash'
	}
})
```

### Useful Information
* By default, an action with the type `RESET` will reset the state to a default empty object (`{}`). You can disable this functionality by setting `options.disableResetAction` to `true` in your initial config (e.g. `new Ramsay('users', { disableResetAction: true })`)

## License
MIT
