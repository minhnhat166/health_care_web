import type { Drug } from '@/@types/drug'
import type { Error } from '@/@types/error'
import { apiGetDrugsId } from '@/services/DrugService'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const SLICE_NAME = 'drugDetail'

export type DrugDetailState = {
    result: Drug | null
    loading: boolean
    error: Error
}

export const initialError: Error = {
    code: null,
    message: '',
}

export const initialDrugDetailState: DrugDetailState = {
    result: null,
    loading: false,
    error: {
        code: null,
        message: '',
    },
}

export const getApiDrugDetail = createAsyncThunk(
    `${SLICE_NAME}/getDrugDetail`,
    async (drugId: string, { rejectWithValue }) => {
        try {
            if (!drugId) {
                return rejectWithValue({
                    code: 400,
                    message: 'Invalid drugId',
                })
            }

            const response = await apiGetDrugsId(drugId)
            console.log('🚀 ~ response:', response)

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

export const drugDetailSlice = createSlice({
    name: SLICE_NAME,
    initialState: initialDrugDetailState,
    reducers: {
        clearError(state) {
            state.error = initialError
        },
    },
    extraReducers(builder) {
        builder.addCase(getApiDrugDetail.pending, (state) => {
            state.loading = true
        })

        builder.addCase(getApiDrugDetail.fulfilled, (state, action) => {
            state.loading = false
            state.result = action.payload ?? null
        })

        builder.addCase(getApiDrugDetail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as Error
        })
    },
})

export const { clearError } = drugDetailSlice.actions
export default drugDetailSlice.reducer
