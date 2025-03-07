import type { Drug } from '@/@types/drug'
import type { Error } from '@/@types/error'
import {
    apiGetDrugs,
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
}

export const initialMetadata: DrugState['metadata'] = {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalElement: 0,
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
    },
})

export const { setTableData, clearError, setSelectedDrug } = DrugSlice.actions
export default DrugSlice.reducer
