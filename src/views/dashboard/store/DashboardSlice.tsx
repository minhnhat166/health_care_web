import type { Drug } from '@/@types/drug'
import type { Error } from '@/@types/error'
import type { User } from '@/@types/user'
import { apiGetCompanyList } from '@/services/CompanyService'
import type {
    ApiGetDrugsRequest,
    ApiGetDrugsResponse,
} from '@/services/DrugService'
import { apiGetDrugs, apiGetDrugsTopSearched } from '@/services/DrugService' // Import the correct API function
import { apiGetUsers } from '@/services/UserService'
import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit'

export const SLICE_NAME = 'dashboard'

export type DashBoardState = {
    totalUser: number
    totalDrug: number
    totalCompany: number
    mostPopularDrug: Drug
    mostPopularDrugs: Drug[]
    loading: boolean
    error: Error
    metadata: {
        page: number
        pageSize: number
        totalPage?: number
        totalElement?: number
    }
}

export const initialMetadata: DashBoardState['metadata'] = {
    page: 1,
    pageSize: 99999,
    totalPage: 0,
    totalElement: 0,
}

export const initialError: DashBoardState['error'] = {
    code: null,
    message: '',
}

export const initialDashBoardState: DashBoardState = {
    totalUser: 0,
    totalDrug: 0,
    totalCompany: 0,
    mostPopularDrug: {} as Drug,
    mostPopularDrugs: [] as Drug[],
    loading: false,
    error: initialError,
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

export const getDrugList = createAsyncThunk<
    ApiGetDrugsResponse,
    ApiGetDrugsRequest
>(
    `${SLICE_NAME}/getDrugList`,
    async ({ page, pageSize }: ApiGetDrugsRequest, { rejectWithValue }) => {
        try {
            if (!page || !pageSize) {
                return rejectWithValue({
                    code: 400,
                    message: 'Invalid page or pageSize',
                }) as any
            }
            const response = await apiGetDrugs<
                ApiGetDrugsResponse,
                ApiGetDrugsRequest
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

export const getDrugTopSearchedList = createAsyncThunk(
    `${SLICE_NAME}/getDrugTopSearchedList`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetDrugsTopSearched()
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

export const getCompanyList = createAsyncThunk(
    `${SLICE_NAME}/getCompanyList`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetCompanyList<{
                total: number
                data: string[]
            }>()
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

export const dashboardSlice = createSlice({
    name: SLICE_NAME,
    initialState: initialDashBoardState,
    reducers: {
        clearError(state) {
            state.error = initialError
        },
        setMetaData(
            state,
            action: PayloadAction<{ page: number; pageSize: number }>,
        ) {
            state.metadata = action.payload
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
    },
    extraReducers(builder) {
        builder.addCase(getUserList.pending, (state) => {
            state.loading = true
        })

        builder.addCase(getUserList.fulfilled, (state, action) => {
            state.loading = false
            state.totalUser = action.payload.totalElement
        })

        builder.addCase(getUserList.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as Error
        })

        builder.addCase(getDrugList.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getDrugList.fulfilled, (state, action) => {
            state.loading = false
            state.totalDrug = action.payload.totalElement

            const sortedDrugs = [...action.payload.data].sort(
                (a, b) => (b.searchCount || 0) - (a.searchCount || 0),
            )

            // Set the most popular drugs (top 5 or all if less than 10)
            state.mostPopularDrugs = sortedDrugs.slice(0, 10)

            // Set the single most popular drug
            state.mostPopularDrug =
                sortedDrugs.length > 0 ? sortedDrugs[0] : ({} as Drug)
        })
        builder.addCase(getDrugList.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as Error
        })
        builder.addCase(getCompanyList.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getCompanyList.fulfilled, (state, action) => {
            state.loading = false
            state.totalCompany = action.payload.total
        })
        builder.addCase(getCompanyList.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as Error
        })

        builder.addCase(getDrugTopSearchedList.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getDrugTopSearchedList.fulfilled, (state, action) => {
            state.loading = false
            state.mostPopularDrugs = action.payload
        })
        builder.addCase(getDrugTopSearchedList.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as Error
        })
    },
})

export const { clearError, setMetaData, setLoading } = dashboardSlice.actions
export default dashboardSlice.reducer
