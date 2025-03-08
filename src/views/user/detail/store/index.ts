import { combineReducers } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'

import type { RootState } from '@/store'
import reducers, {
    type SLICE_NAME,
    type UserDetailState,
} from './UserDetailSlice'

const reducer = combineReducers({
    items: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            items: UserDetailState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './UserDetailSlice'
export default reducer
