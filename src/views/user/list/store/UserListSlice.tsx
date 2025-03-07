import type { Error } from '@/@types/error'
import type { User } from '@/@types/user'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'userList'

export type UserListState = {
    result: User[]
    loading: boolean
    error: Error
    selectedUser: string
    metadata: {
        page: number
        pageSize: number
        totalPage?: number
        totalElement?: number
    }
}

export const initialMetadata: UserListState['metadata'] = {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalElement: 0,
}

export const initialError: UserListState['error'] = {
    code: null,
    message: '',
}

export const initialUserListState: UserListState = {
    result: [] as User[],
    loading: false,
    error: initialError,
    selectedUser: '',
    metadata: initialMetadata,
}

export const userListSlice = createSlice({
    name: SLICE_NAME,
    initialState: initialUserListState,
    reducers: {
        clearError(state) {
            state.error = initialError
        },
        setSelectedUser(state, action) {
            state.selectedUser = action.payload
        },
        setMetaData(
            state,
            action: PayloadAction<{ page: number; pageSize: number }>,
        ) {
            state.metadata = action.payload
        },
    },
    extraReducers(builder) {},
})

export const { clearError, setMetaData, setSelectedUser } =
    userListSlice.actions
export default userListSlice.reducer
