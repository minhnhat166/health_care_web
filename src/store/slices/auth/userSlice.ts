import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    avatar?: string
    name?: string
    id?: string
    email?: string
    role?: string
    authority?: string[]
}

export const initialUserState: UserState = {
    avatar: '',
    name: '',
    email: '',
    role: '',
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState: initialUserState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload?.id
            state.avatar = action.payload?.avatar
            state.email = action.payload?.email
            state.name = action.payload?.name
            state.role = action.payload?.role
            state.authority = action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
