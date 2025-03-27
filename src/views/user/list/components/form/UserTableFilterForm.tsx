import { Button, FormContainer } from '@/components/ui'
import { useAppSelector as useMainAppSelector } from '@/store'
import { Form, Formik, FormikHelpers } from 'formik'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClear, MdSearch } from 'react-icons/md'
import * as Yup from 'yup'
import {
    getUserList,
    getUserListByKeyword,
    setSearch,
    useAppDispatch,
    useAppSelector,
} from '../../store'
import { KeywordFields } from './field'

interface UserTableFilterFormProps {
    onFilterComplete?: () => void
}

export interface FilterData {
    keyword: string | null
}

const filterValidationSchema = Yup.object().shape({
    keyword: Yup.string().nullable(),
})

const UserTableFilterForm = ({
    onFilterComplete,
}: UserTableFilterFormProps) => {
    const dispatch = useAppDispatch()
    const setIsReset = useState(false)[1]

    const { t } = useTranslation()

    const { id: userId } = useMainAppSelector((state) => state.auth.user)
    const { loading, search: reduxFilterData } = useAppSelector(
        (state) => state.userList.items,
    )

    // Create dynamic initial values based on Redux state
    const getInitialValues = useCallback(
        () => ({
            keyword: reduxFilterData.keyword || null,
        }),
        [reduxFilterData],
    )

    const hasActiveFilters = useCallback((values: FilterData): boolean => {
        const { keyword } = values

        const hasKeyword = keyword !== null

        return hasKeyword
    }, [])

    const handleSubmit = useCallback(
        async (
            values: FilterData,
            { setSubmitting }: FormikHelpers<FilterData>,
        ) => {
            const requestData = {
                keyword: values.keyword?.trim() || '',
            }

            // Update Redux state
            dispatch(setSearch({ key: 'keyword', value: requestData.keyword }))

            if (requestData.keyword === '') {
                await dispatch(getUserList({ page: 1, pageSize: 10 }))
            } else if (userId) {
                // Fetch filtered data
                await dispatch(getUserListByKeyword(requestData))
            }

            setSubmitting(false)
            onFilterComplete?.()
        },
        [dispatch, onFilterComplete, userId],
    )

    const handleReset = useCallback(
        async (setValues: (values: FilterData) => void) => {
            setIsReset(true)

            // Reset form with null values
            const resetValues: FilterData = {
                keyword: null,
            }
            setValues(resetValues)

            // Update Redux state
            dispatch(setSearch({ key: 'keyword', value: '' }))

            if (userId) {
                // Fetch default data
                await dispatch(getUserList({ page: 1, pageSize: 10 }))
            }

            setTimeout(() => {
                setIsReset(false)
            }, 100)

            onFilterComplete?.()
        },
        [dispatch, onFilterComplete, setIsReset, userId],
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
                                <KeywordFields />
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
                                    {t('views.user.list.form.resetButton')}
                                </Button>
                                <Button
                                    variant="solid"
                                    size="xs"
                                    icon={<MdSearch />}
                                    loading={loading}
                                    type="submit"
                                >
                                    {t('views.user.list.form.searchButton')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default UserTableFilterForm
