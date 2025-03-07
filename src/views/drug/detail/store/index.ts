import { combineReducers } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'

import type { RootState } from '@/store'
import reducers, {
    type DrugDetailState,
    type SLICE_NAME,
} from './DrugDetailSlice'

const reducer = combineReducers({
    items: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            items: DrugDetailState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './DrugDetailSlice'
export default reducer
