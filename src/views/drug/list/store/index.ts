import { combineReducers } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'

import type { RootState } from '@/store'
import reducers, { type DrugState, type SLICE_NAME } from './DrugSlice'

const reducer = combineReducers({
    items: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            items: DrugState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './DrugSlice'
export default reducer
