import type { Drug } from '@/@types/drug'
import type { Error } from '@/@types/error'
import {
    apiGetDrugs,
    apiGetDrugsFilter,
    type ApiGetDrugsRequest,
    type ApiGetDrugsResponse,
} from '@/services/DrugService'
import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit'

export const SLICE_NAME = 'drug'

export type DrugState = {
    result: Drug[]
    loading: boolean
    error: Error
    selectedDrug: string
    metadata: {
        page: number
        pageSize: number
        totalPage?: number
        totalElement?: number
    }
    filter: {
        Status: string
        Category: string
        Group: string
    }
}

export const initialMetadata: DrugState['metadata'] = {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalElement: 0,
}

export const initialFilter: DrugState['filter'] = {
    Status: '',
    Category: '',
    Group: '',
}

export const initialError: DrugState['error'] = {
    code: null,
    message: '',
}

export const initialState: DrugState = {
    result: [] as Drug[],
    loading: false,
    error: initialError,
    selectedDrug: '',
    metadata: initialMetadata,
    filter: initialFilter,
}

export const getApiDrugs = createAsyncThunk<
    ApiGetDrugsResponse,
    ApiGetDrugsRequest
>(
    `${SLICE_NAME}/getDrugs`,
    async ({ page, pageSize }: ApiGetDrugsRequest, { rejectWithValue }) => {
        try {
            if (!page || !pageSize) {
                return rejectWithValue({
                    code: 400,
                    message: 'Invalid page or pageSize',
                })
            }
            const response = await apiGetDrugs<
                ApiGetDrugsResponse,
                ApiGetDrugsRequest
            >({
                page: page,
                pageSize: pageSize,
            })
            return response.data
        } catch (error: any) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data)
            }
            return rejectWithValue({
                code: error.response?.status || 500,
                message: 'An error occurred, please try again later',
            })
        }
    },
)

export type DrugFilterRequest = {
    page: number
    pageSize: number
    Status?: string | null // Changed to string | null for consistency
    Category?: string | null // Changed to string | null for consistency
    Group?: string | null // Changed to string | null for consistency
}

export const getDrugsFilter = createAsyncThunk<
    ApiGetDrugsResponse,
    DrugFilterRequest
>(
    `${SLICE_NAME}/getDrugsFilter`,

    async (
        { page, pageSize, Status, Category, Group }: DrugFilterRequest,
        { rejectWithValue },
    ) => {
        try {
            if (!page || !pageSize) {
                return rejectWithValue({
                    code: 400,
                    message: 'Invalid page or pageSize',
                })
            }
            const requestPayload: DrugFilterRequest = {
                page,
                pageSize,
                // Convert null to undefined to avoid sending null values in requests
                ...(Status !== null && Status !== undefined ? { Status } : {}),
                ...(Category !== null && Category !== undefined
                    ? { Category }
                    : {}),
                ...(Group !== null && Group !== undefined ? { Group } : {}),
            }

            const response = await apiGetDrugsFilter<
                ApiGetDrugsResponse,
                DrugFilterRequest
            >(requestPayload)

            // Ensure only response.data is returned
            return response.data
        } catch (error: any) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data)
            }
            return rejectWithValue({
                code: error.response?.status || 500,
                message: 'An error occurred, please try again later',
            })
        }
    },
)

export const DrugSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTableData(
            state,
            action: PayloadAction<{ page: number; pageSize: number }>,
        ) {
            state.metadata = action.payload
        },
        clearError(state) {
            state.error = initialError
        },
        setSelectedDrug(state, action) {
            state.selectedDrug = action.payload
        },
        setFilter(
            state,
            action: PayloadAction<{
                key: keyof DrugState['filter']
                value: string | null
            }>,
        ) {
            const { key, value } = action.payload
            state.filter[key] = value === null ? '' : value
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getApiDrugs.pending, (state) => {
                state.loading = true
            })
            .addCase(getApiDrugs.fulfilled, (state, action) => {
                state.loading = false
                state.result = action.payload.data
                state.metadata = {
                    page: action.payload.currentPage,
                    pageSize: action.payload.pageSize,
                    totalPage: action.payload.totalPage,
                    totalElement: action.payload.totalElement,
                }
            })
            .addCase(getApiDrugs.rejected, (state, action) => {
                state.loading = false
                state.result = []
                state.error = action.payload as unknown as Error
            })

        builder
            .addCase(getDrugsFilter.pending, (state) => {
                state.loading = true
            })
            .addCase(getDrugsFilter.fulfilled, (state, action) => {
                state.loading = false

                state.result = action.payload.data || []

                state.metadata = {
                    page: action.payload.currentPage || 1,
                    pageSize: action.payload.pageSize || 10,
                    totalPage: action.payload.totalPage || 0,
                    totalElement: action.payload.totalElement || 0,
                }
            })
            .addCase(getDrugsFilter.rejected, (state, action) => {
                state.loading = false
                state.result = []
                state.error = action.payload as unknown as Error
            })
    },
})

export const { setTableData, clearError, setSelectedDrug, setFilter } =
    DrugSlice.actions
export default DrugSlice.reducer
