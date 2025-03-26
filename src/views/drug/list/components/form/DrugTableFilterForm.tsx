import { Button, FormContainer } from '@/components/ui'
import { useAppSelector as useMainAppSelector } from '@/store'
import { Form, Formik, FormikHelpers } from 'formik'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClear, MdSearch } from 'react-icons/md'
import * as Yup from 'yup'
import {
    getDrugsFilter,
    setFilter,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../../store'
import { StatusFields } from './field'
import CategoryFields from './field/CategoryFields'
import GroupFields from './field/GroupFields'

interface DrugTableFilterFormProps {
    onFilterComplete?: () => void
}

export interface FilterData {
    Status?: 'Created' | 'Approved' | 'Updated' | 'Inactive' | null
    Category?: 'ThuocKeDon' | 'ThuocKhongKeDon' | null
    Group?: 'TanDuoc' | 'DongDuoc' | null
}

const filterValidationSchema = Yup.object().shape({
    Status: Yup.string().nullable(),
    Category: Yup.string().nullable(),
    Group: Yup.string().nullable(),
})

const QRBoxTableFilterForm = ({
    onFilterComplete,
}: DrugTableFilterFormProps) => {
    const dispatch = useAppDispatch()
    const setIsReset = useState(false)[1]

    const { t } = useTranslation()

    const { id: userId } = useMainAppSelector((state) => state.auth.user)
    const {
        metadata,
        loading,
        filter: reduxFilterData,
    } = useAppSelector((state) => state.drug.items)

    // Create dynamic initial values based on Redux state
    const getInitialValues = useCallback(
        (): FilterData => ({
            Status: (reduxFilterData.Status as FilterData['Status']) || null,
            Category:
                (reduxFilterData.Category as FilterData['Category']) || null,
            Group: (reduxFilterData.Group as FilterData['Group']) || null,
        }),
        [reduxFilterData],
    )

    const filterBy = 1

    const hasActiveFilters = useCallback((values: FilterData): boolean => {
        const { Status, Category, Group } = values

        const hasStatus = Status !== null
        const hasCategory = Category !== null
        const hasGroup = Group !== null

        return hasStatus || hasCategory || hasGroup
    }, [])

    const handleSubmit = useCallback(
        async (
            values: FilterData,
            { setValues }: FormikHelpers<FilterData>,
        ) => {
            // Update Redux state
            dispatch(setFilter({ key: 'Status', value: values.Status ?? '' }))
            dispatch(
                setFilter({ key: 'Category', value: values.Category ?? '' }),
            )
            dispatch(setFilter({ key: 'Group', value: values.Group ?? '' }))

            // Update table data and fetch
            dispatch(setTableData({ page: 1, pageSize: metadata.pageSize }))
            if (userId)
                await dispatch(
                    getDrugsFilter({
                        page: 1,
                        pageSize: metadata.pageSize,
                        Status: values.Status || null,
                        Category: values.Category || null,
                        Group: values.Group || null,
                    }),
                )

            // Update form values to maintain consistency
            setValues(values)

            onFilterComplete?.()
        },
        [dispatch, metadata.pageSize, onFilterComplete, filterBy, userId],
    )

    const handleReset = useCallback(
        async (setValues: (values: FilterData) => void) => {
            setIsReset(true)

            // Reset form with null values
            const resetValues: FilterData = {
                Status: null,
                Category: null,
                Group: null,
            }
            setValues(resetValues)

            // Update Redux state
            dispatch(setFilter({ key: 'Status', value: '' }))
            dispatch(setFilter({ key: 'Category', value: '' }))
            dispatch(setFilter({ key: 'Group', value: '' }))

            // Update table data and fetch
            dispatch(setTableData({ page: 1, pageSize: metadata.pageSize }))

            // API call empty request
            if (userId)
                await dispatch(
                    getDrugsFilter({
                        page: 1,
                        pageSize: metadata.pageSize,
                        Status: null,
                        Category: null,
                        Group: null,
                    }),
                )

            setTimeout(() => {
                setIsReset(false)
            }, 100)

            onFilterComplete?.()
        },
        [dispatch, metadata.pageSize, onFilterComplete, setIsReset, userId],
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
                                <CategoryFields />
                                {/* Status */}
                                <StatusFields />
                                {/* Tìm Kiếm Value - Giá trị để search */}
                                <GroupFields />
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
                                    {t('views.drug.filter.buttons.clear')}
                                </Button>
                                <Button
                                    variant="solid"
                                    size="xs"
                                    icon={<MdSearch />}
                                    loading={loading}
                                    type="submit"
                                >
                                    {t('views.drug.filter.buttons.search')}
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
