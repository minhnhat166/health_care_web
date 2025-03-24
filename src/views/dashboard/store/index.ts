import { combineReducers } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'

import type { RootState } from '@/store'
import reducers, {
    type DashBoardState,
    type SLICE_NAME,
} from './DashboardSlice'

const reducer = combineReducers({
    items: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            items: DashBoardState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './DashboardSlice'
export default reducer
