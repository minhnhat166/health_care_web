import { combineReducers } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'

import type { RootState } from '@/store'
import reducers, { type SLICE_NAME, type UserListState } from './UserListSlice'

const reducer = combineReducers({
    items: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            items: UserListState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './UserListSlice'
export default reducer
