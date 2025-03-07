import type { Error } from '@/@types/error'
import type { User } from '@/@types/user'
import { apiGetUsers } from '@/services/UserService'
import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit'

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

export type UserListResponse = {
    data: User[]
    currentPage: number
    pageSize: number
    totalPage: number
    totalElement: number
}

export type UserListRequest = {
    page: number
    pageSize: number
}

export const getUserList = createAsyncThunk<UserListResponse, UserListRequest>(
    `${SLICE_NAME}/getUserList`,
    async ({ page, pageSize }: UserListRequest, { rejectWithValue }) => {
        try {
            if (!page || !pageSize) {
                return rejectWithValue({
                    code: 400,
                    message: 'Invalid page or pageSize',
                }) as any
            }
            const response = await apiGetUsers<
                UserListResponse,
                UserListRequest
            >({
                page,
                pageSize,
            })
            if (response?.data) {
                return response.data
            }
            return rejectWithValue({
                code: 500,
                message: 'No data received',
            }) as any
        } catch (error: any) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data) as any
            }
            return rejectWithValue({
                code: 500,
                message: 'Internal server error',
            }) as any
        }
    },
)

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
    extraReducers(builder) {
        builder.addCase(getUserList.pending, (state) => {
            state.loading = true
        })

        builder.addCase(getUserList.fulfilled, (state, action) => {
            state.loading = false
            state.result = action.payload.data
            state.metadata = {
                page: action.payload.currentPage,
                pageSize: action.payload.pageSize,
                totalPage: action.payload.totalPage,
                totalElement: action.payload.totalElement,
            }
        })

        builder.addCase(getUserList.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as Error
        })
    },
})

export const { clearError, setMetaData, setSelectedUser } =
    userListSlice.actions
export default userListSlice.reducer
