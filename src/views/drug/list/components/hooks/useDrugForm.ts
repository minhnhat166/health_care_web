import type { Drug } from '@/@types/drug'
import { apiGetDrugsId, apiPutDrugsId } from '@/services/DrugService'
import useToast from '@/utils/useToast'
import { TFunction } from 'i18next'
import { useCallback, useEffect, useMemo, useReducer } from 'react'
import * as Yup from 'yup'

export const EDITABLE_FIELDS = [
    'tenThuoc',
    'dotPheDuyet',
    'soQuyetDinh',
    'pheDuyet',
    'hieuLuc',
    'hoatChat',
    'phanLoai',
    'nongDo',
    'taDuoc',
    'baoChe',
    'dongGoi',
    'tieuChuan',
    'tuoiTho',
    'congTySx',
    'congTySxCode',
    'nuocSx',
    'diaChiSx',
    'congTyDk',
    'nuocDk',
    'diaChiDk',
    'giaKeKhai',
    'huongDanSuDung',
    'huongDanSuDungBn',
    'nhomThuoc',
    'rate',
    'rutSdk',
    'fileName',
    'isHide',
    'state',
    'images',
] as const

export type EditableDrugFields = Pick<Drug, (typeof EDITABLE_FIELDS)[number]>

interface UseDrugFormProps {
    drugId: string
    onSave?: (values: Partial<Drug>) => void
    onSuccess?: () => void
    t: TFunction
}

const createValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        tenThuoc: Yup.string().required(
            t('views.drug.components.form.validation.drugNameRequired'),
        ),
        hoatChat: Yup.string().required(
            t('views.drug.components.form.validation.activeIngredientRequired'),
        ),
        phanLoai: Yup.string(),
        nongDo: Yup.string(),
        taDuoc: Yup.string(),
        baoChe: Yup.string(),
        dongGoi: Yup.string(),
        tieuChuan: Yup.string(),
        tuoiTho: Yup.string(),
        congTySx: Yup.string().required(
            t('views.drug.components.form.validation.manufacturerRequired'),
        ),
        congTySxCode: Yup.string(),
        nuocSx: Yup.string().required(
            t(
                'views.drug.components.form.validation.countryOfManufactureRequired',
            ),
        ),
        diaChiSx: Yup.string(),
        congTyDk: Yup.string().required(
            t(
                'views.drug.components.form.validation.registrationCompanyRequired',
            ),
        ),
        nuocDk: Yup.string(),
        diaChiDk: Yup.string(),
        giaKeKhai: Yup.number()
            .typeError(
                t('views.drug.components.form.validation.priceNumbersOnly'),
            )
            .nullable()
            .transform((value, originalValue) =>
                originalValue === '' ? null : Number(originalValue),
            ),
        huongDanSuDung: Yup.string(),
        huongDanSuDungBn: Yup.string(),
        nhomThuoc: Yup.string(),
        rate: Yup.number(),
        rutSdk: Yup.string(),
        fileName: Yup.string(),
        isHide: Yup.boolean(),
        state: Yup.string(),
        images: Yup.array().of(Yup.string()),
    })

type FormState = {
    isOpen: boolean
    drugData: Drug | null
    isLoading: boolean
    isSaving: boolean
    error: string | null
}

type FormAction =
    | { type: 'OPEN_MODAL' }
    | { type: 'CLOSE_MODAL' }
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Drug }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SAVE_START' }
    | { type: 'SAVE_SUCCESS' }
    | { type: 'SAVE_ERROR'; payload: string }

const initialState: FormState = {
    isOpen: false,
    drugData: null,
    isLoading: false,
    isSaving: false,
    error: null,
}

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { ...state, isOpen: true, error: null }
        case 'CLOSE_MODAL':
            return { ...state, isOpen: false, error: null }
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null }
        case 'FETCH_SUCCESS':
            return { ...state, isLoading: false, drugData: action.payload }
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload }
        case 'SAVE_START':
            return { ...state, isSaving: true, error: null }
        case 'SAVE_SUCCESS':
            return { ...state, isSaving: false }
        case 'SAVE_ERROR':
            return { ...state, isSaving: false, error: action.payload }
        default:
            return state
    }
}

export const useDrugForm = ({
    drugId,
    onSave,
    onSuccess,
    t,
}: UseDrugFormProps) => {
    const [state, dispatch] = useReducer(formReducer, initialState)
    const { isOpen, drugData, isLoading, isSaving, error } = state

    const toast = useToast()

    const handleError = useCallback(
        (messageKey: string) => {
            dispatch({ type: 'FETCH_ERROR', payload: messageKey })
            toast({
                title: t('views.drug.components.toast.error'),
                children: t(messageKey),
                type: 'danger',
            })
        },
        [t, toast],
    )

    const fetchDrugData = useCallback(async () => {
        if (!drugId || !isOpen) return

        dispatch({ type: 'FETCH_START' })
        try {
            const response = await apiGetDrugsId(drugId)
            console.log('🚀 ~ fetchDrugData ~ response:', response)
            if (response?.data) {
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data })
            } else {
                throw new Error('No data returned')
            }
        } catch (error) {
            handleError('views.drug.components.toast.errorFetchingDrugData')
        }
    }, [drugId, isOpen, handleError])

    useEffect(() => {
        if (isOpen) {
            fetchDrugData()
        }
    }, [isOpen, fetchDrugData])

    const handleOpen = useCallback(() => {
        dispatch({ type: 'OPEN_MODAL' })
    }, [])

    const handleClose = useCallback(() => {
        dispatch({ type: 'CLOSE_MODAL' })
    }, [])

    const validationSchema = useMemo(() => createValidationSchema(t), [t])

    const initialValues: EditableDrugFields = useMemo(() => {
        if (!drugData) {
            return EDITABLE_FIELDS.reduce(
                (acc, field) => ({ ...acc, [field]: '' }),
                {} as EditableDrugFields,
            )
        }
        return EDITABLE_FIELDS.reduce(
            (acc, field) => ({
                ...acc,
                [field]: drugData[field] ?? '',
            }),
            {} as EditableDrugFields,
        )
    }, [drugData])

    const handleSubmit = useCallback(
        async (
            values: EditableDrugFields,
            {
                setSubmitting,
            }: { setSubmitting: (isSubmitting: boolean) => void },
        ) => {
            dispatch({ type: 'SAVE_START' })
            try {
                const dataToSubmit = {
                    ...values,
                    giaKeKhai: values.giaKeKhai
                        ? Number(values.giaKeKhai)
                        : null,
                }

                await apiPutDrugsId(drugId, dataToSubmit as Drug)
                if (onSave) onSave(values)

                toast({
                    title: t('views.drug.components.toast.success'),
                    children: t(
                        'views.drug.components.toast.drugUpdatedSuccess',
                    ),
                    type: 'success',
                })

                dispatch({ type: 'SAVE_SUCCESS' })
                if (onSuccess) onSuccess()
                handleClose()
            } catch (error) {
                dispatch({
                    type: 'SAVE_ERROR',
                    payload: 'views.drug.components.toast.errorUpdatingDrug',
                })
                handleError('views.drug.components.toast.errorUpdatingDrug')
            } finally {
                setSubmitting(false)
            }
        },
        [drugId, onSave, onSuccess, t, toast, handleClose, handleError],
    )

    return {
        isOpen,
        isLoading,
        isSaving,
        error,
        drugData,
        validationSchema,
        initialValues,
        handleOpen,
        handleClose,
        handleSubmit,
        fetchDrugData,
    }
}
