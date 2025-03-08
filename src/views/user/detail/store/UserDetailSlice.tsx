import type { Error } from '@/@types/error'
import type { User } from '@/@types/user'
import { apiGetUsersId } from '@/services/UserService'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const SLICE_NAME = 'userDetail'

export type UserDetailState = {
    result: User | null
    loading: boolean
    error: Error
}

export const initialError: UserDetailState['error'] = {
    code: null,
    message: '',
}

export const initialUserDetailState: UserDetailState = {
    result: null,
    loading: false,
    error: initialError,
}

export const getApiUserDetail = createAsyncThunk(
    `${SLICE_NAME}/getUserDetail`,
    async (drugId: string, { rejectWithValue }) => {
        try {
            if (!drugId) {
                return rejectWithValue({
                    code: 400,
                    message: 'Invalid drugId',
                })
            }

            const response = await apiGetUsersId(drugId)

            if (response?.data) {
                return response.data
            }
        } catch (error) {
            return rejectWithValue({
                code: 500,
                message: 'Internal server error',
            })
        }
    },
)

export const userDetailSLice = createSlice({
    name: SLICE_NAME,
    initialState: initialUserDetailState,
    reducers: {
        clearError(state) {
            state.error = initialError
        },
    },
    extraReducers(builder) {
        builder.addCase(getApiUserDetail.pending, (state) => {
            state.loading = true
        })

        builder.addCase(getApiUserDetail.fulfilled, (state, action) => {
            state.loading = false
            state.result = action.payload as User
        })

        builder.addCase(getApiUserDetail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as Error
        })
    },
})

export const { clearError } = userDetailSLice.actions
export default userDetailSLice.reducer
