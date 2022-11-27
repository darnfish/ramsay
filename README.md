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
	id: number
	name: string
}

const users = new Ramsay<User>('users') // for non-TS users: const users = new Ramsay('users')

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

## License
?
