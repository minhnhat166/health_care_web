import { Button, FormContainer } from '@/components/ui'
import { useAppSelector as useMainAppSelector } from '@/store'
import { Form, Formik, FormikHelpers } from 'formik'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClear, MdSearch } from 'react-icons/md'
import * as Yup from 'yup'
import {
    getAllQRBox,
    setTableData,
    updateStatus,
    updateType,
    updateValue,
    useAppDispatch,
    useAppSelector,
} from '../../store'
import { StatusFields, TypeFields, ValueFields } from './field'

interface QRBoxTableFilterFormProps {
    onFilterComplete?: () => void
}

export interface FilterData {
    type: number | null
    value: string | null
    status: number | null
}

const filterValidationSchema = Yup.object().shape({
    type: Yup.number().nullable(),
    value: Yup.string().nullable(),
    status: Yup.number().nullable(),
})

const QRBoxTableFilterForm = ({
    onFilterComplete,
}: QRBoxTableFilterFormProps) => {
    const dispatch = useAppDispatch()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setIsReset = useState(false)[1]

    const { t } = useTranslation()

    const { userId } = useMainAppSelector((state) => state.auth.user)
    const {
        metadata,
        loading,
        filterData: reduxFilterData,
        filterBy,
    } = useAppSelector((state) => state.QRBoxList.items)

    // Create dynamic initial values based on Redux state
    const getInitialValues = useCallback(
        () => ({
            type: reduxFilterData.type || null,
            value: reduxFilterData.value || null,
            status: reduxFilterData.status || null,
        }),
        [reduxFilterData],
    )

    const hasActiveFilters = useCallback((values: FilterData): boolean => {
        const { type, value, status } = values

        const hasType = type !== null
        const hasValue = value !== null
        const hasStatus = status !== null

        return hasType || hasValue || hasStatus
    }, [])

    const handleSubmit = useCallback(
        async (
            values: FilterData,
            { setValues }: FormikHelpers<FilterData>,
        ) => {
            const requestData = {
                page: 1,
                size: metadata.size,
                type: values.type ?? 9,
                value: values.value ?? '',
                status: values.status ?? -1,
                mid: 'null',
                filterBy: filterBy,
            }

            // Update Redux state
            dispatch(updateType({ type: values.type ?? 9 }))
            dispatch(updateValue({ value: values.value ?? '' }))
            dispatch(updateStatus({ status: values.status ?? -1 }))

            // Update table data and fetch
            dispatch(setTableData({ page: 1, size: metadata.size }))
            if (userId)
                await dispatch(getAllQRBox({ userId, data: requestData }))

            // Update form values to maintain consistency
            setValues(values)

            onFilterComplete?.()
        },
        [dispatch, metadata.size, onFilterComplete, filterBy, userId],
    )

    const handleReset = useCallback(
        async (setValues: (values: FilterData) => void) => {
            setIsReset(true)

            // Reset form with null values
            const resetValues: FilterData = {
                type: 9,
                value: '',
                status: -1,
            }
            setValues(resetValues)

            const emptyRequest = {
                page: 1,
                size: metadata.size,
                type: 9,
                value: '',
                status: -1,
                mid: 'null',
                filterBy: 1,
            }

            // Update Redux state
            dispatch(updateType(null))
            dispatch(updateValue(null))
            dispatch(updateStatus(null))
            dispatch(setTableData({ page: 1, size: metadata.size }))

            // API call empty request
            if (userId)
                await dispatch(getAllQRBox({ userId, data: emptyRequest }))

            setTimeout(() => {
                setIsReset(false)
            }, 100)

            onFilterComplete?.()
        },
        [dispatch, metadata.size, onFilterComplete, setIsReset, userId],
    )

    return (
        <div className="mb-4">
            <Formik
                enableReinitialize={true}
                initialValues={getInitialValues()}
                validationSchema={filterValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setValues, submitForm }) => (
                    <Form
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                submitForm()
                            }
                        }}
                    >
                        <FormContainer>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Type */}
                                <TypeFields />
                                {/* Status */}
                                <StatusFields />
                                {/* Tìm Kiếm Value - Giá trị để search */}
                                <ValueFields />
                            </div>
                            <div className="flex flex-col justify-end space-y-4">
                                <Button
                                    variant="twoTone"
                                    color="red-600"
                                    size="xs"
                                    type="button"
                                    disabled={!hasActiveFilters(values)}
                                    icon={<MdClear />}
                                    onClick={() => handleReset(setValues)}
                                >
                                    {t(
                                        'transactions.transactionList.transactionTableTools.transactionTableFilterForm.clearButton',
                                    )}
                                </Button>
                                <Button
                                    variant="solid"
                                    size="xs"
                                    icon={<MdSearch />}
                                    loading={loading}
                                    type="submit"
                                >
                                    {t(
                                        'transactions.transactionList.transactionTableTools.transactionTableFilterForm.searchButton',
                                    )}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default QRBoxTableFilterForm
