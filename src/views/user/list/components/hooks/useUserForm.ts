import type { User } from '@/@types/user'
import { UserRole } from '@/constants/roles.constant'
import { apiGetUsersId, apiPutUsersId } from '@/services/UserService'
import { useAppDispatch } from '@/store'
import useToast from '@/utils/useToast'
import { TFunction } from 'i18next'
import { useCallback, useEffect, useMemo, useReducer } from 'react'
import * as Yup from 'yup'
import { getUserList } from '../../store'

export const EDITABLE_FIELDS = [
    'userId',
    'name',
    'email',
    'phoneNumber',
    'role',
] as const

export type EditableUserFields = Pick<User, (typeof EDITABLE_FIELDS)[number]>

interface UseUserFormProps {
    id: string
    onSave?: (values: Partial<User>) => void
    onSuccess?: () => void
    t: TFunction
}

const createValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        userId: Yup.string().required(
            t('views.user.components.form.validation.userIdRequired'),
        ),
        name: Yup.string().required(
            t('views.user.components.form.validation.nameRequired'),
        ),
        email: Yup.string()
            .email(t('views.user.components.form.validation.emailInvalid'))
            .required(t('views.user.components.form.validation.emailRequired')),
        phoneNumber: Yup.string().required(
            t('views.user.components.form.validation.phoneNumberRequired'),
        ),
        role: Yup.string().nullable(),
    })

type FormState = {
    isOpen: boolean
    userData: User | null
    isLoading: boolean
    isSaving: boolean
    error: string | null
}

type FormAction =
    | { type: 'OPEN_MODAL' }
    | { type: 'CLOSE_MODAL' }
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: User }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SAVE_START' }
    | { type: 'SAVE_SUCCESS' }
    | { type: 'SAVE_ERROR'; payload: string }

const initialState: FormState = {
    isOpen: false,
    userData: null,
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
            return { ...state, isLoading: false, userData: action.payload }
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

export const useUserForm = ({ id, onSave, onSuccess, t }: UseUserFormProps) => {
    const [state, dispatch] = useReducer(formReducer, initialState)
    const dispatcher = useAppDispatch()
    const { isOpen, userData, isLoading, isSaving, error } = state

    const toast = useToast()

    const handleError = useCallback(
        (messageKey: string) => {
            dispatch({ type: 'FETCH_ERROR', payload: messageKey })
            // toast({
            //     title: t('views.user.components.toast.error'),
            //     children: t(messageKey),
            //     type: 'danger',
            // })
        },
        [t, toast],
    )

    const fetchData = useCallback(async () => {
        if (!id || !isOpen) return

        dispatch({ type: 'FETCH_START' })
        try {
            const response = await apiGetUsersId(id)
            if (response?.data) {
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: response.data as User,
                })
            } else {
                throw new Error('No data returned')
            }
        } catch (error) {
            handleError('views.user.components.toast.errorFetchingUserData')
        }
    }, [id, isOpen, handleError])

    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen, fetchData])

    const handleOpen = useCallback(() => {
        dispatch({ type: 'OPEN_MODAL' })
    }, [])

    const handleClose = useCallback(() => {
        dispatch({ type: 'CLOSE_MODAL' })
    }, [])

    const validationSchema = useMemo(() => createValidationSchema(t), [t])

    const initialValues: EditableUserFields = useMemo(() => {
        if (!userData) {
            return EDITABLE_FIELDS.reduce(
                (acc, field) => ({ ...acc, [field]: '' }),
                {} as EditableUserFields,
            )
        }
        return EDITABLE_FIELDS.reduce(
            (acc, field) => ({
                ...acc,
                [field]: userData[field] ?? '',
            }),
            {} as EditableUserFields,
        )
    }, [userData])

    const handleSubmit = useCallback(
        async (
            values: EditableUserFields,
            {
                setSubmitting,
            }: { setSubmitting: (isSubmitting: boolean) => void },
        ) => {
            dispatch({ type: 'SAVE_START' })
            try {
                await apiPutUsersId(id, {
                    ...values,
                    Fcmtoken: userData?.Fcmtoken ?? '',
                } as User)

                if (onSave) onSave(values)

                toast({
                    title: t('views.user.components.toast.success'),
                    children: t(
                        'views.user.components.toast.userUpdatedSuccess',
                    ),
                    type: 'success',
                })

                dispatch({ type: 'SAVE_SUCCESS' })
                dispatcher(getUserList({ page: 1, pageSize: 10 }))
                if (onSuccess) onSuccess()
                handleClose()
            } catch (error) {
                const errorMsg = 'views.user.components.toast.errorUpdatingUser'
                dispatch({ type: 'SAVE_ERROR', payload: errorMsg })
                handleError(errorMsg)
            } finally {
                setSubmitting(false)
            }
        },
        [
            id,
            onSave,
            onSuccess,
            userData,
            t,
            toast,
            dispatcher,
            handleClose,
            handleError,
        ],
    )

    return {
        isOpen,
        isLoading,
        isSaving,
        error,
        userData,
        validationSchema,
        initialValues,
        handleOpen,
        handleClose,
        handleSubmit,
        fetchData,
    }
}
