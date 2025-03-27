import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdClear, MdSearch } from 'react-icons/md'
import * as Yup from 'yup'
import {
    getDrugsSearch,
    setSearch,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../../store'

// Form validation schema - moved outside component to prevent recreation
const filterValidationSchema = Yup.object().shape({
    Name: Yup.string().nullable(),
    Ingredient: Yup.string().nullable(),
    Company: Yup.string().nullable(),
})

interface DrugTableSearchFormProps {
    onFilterComplete?: () => void
}

export interface FilterData {
    Name?: string | null
    Ingredient?: string | null
    Company?: string | null
}

// Memoized form field component
const SearchField = memo(
    ({
        label,
        name,
        placeholder,
    }: {
        label: string
        name: string
        placeholder: string
    }) => (
        <div className="space-y-4">
            <FormItem label={label}>
                <Field name={name}>
                    {({ field }: FieldProps) => (
                        <Input
                            {...field}
                            type="text"
                            placeholder={placeholder}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    ),
)

SearchField.displayName = 'SearchField'

// Memoized form buttons
const FormButtons = memo(
    ({
        hasActiveFilters,
        loading,
        onReset,
        t,
    }: {
        hasActiveFilters: boolean
        loading: boolean
        onReset: () => void
        t: (key: string) => string
    }) => (
        <div className="flex flex-col justify-end space-y-4">
            <Button
                variant="twoTone"
                color="red-600"
                size="xs"
                type="button"
                disabled={!hasActiveFilters}
                icon={<MdClear />}
                onClick={onReset}
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
    ),
)

FormButtons.displayName = 'FormButtons'

const DrugTableSearchForm = ({
    onFilterComplete,
}: DrugTableSearchFormProps) => {
    const dispatch = useAppDispatch()
    const [isReset, setIsReset] = useState(false)
    const { t } = useTranslation()

    const {
        metadata,
        loading,
        search: reduxFilterData,
    } = useAppSelector((state) => state.drug.items)

    // Calculate initial values based on redux state
    const initialValues = useMemo(
        (): FilterData => ({
            Name: reduxFilterData.Name || null,
            Ingredient: reduxFilterData.Ingredient || null,
            Company: reduxFilterData.Company || null,
        }),
        [reduxFilterData],
    )

    const hasActiveFilters = useCallback((values: FilterData): boolean => {
        const { Name, Ingredient, Company } = values
        return (
            (!!Name && Name !== '') ||
            (!!Ingredient && Ingredient !== '') ||
            (!!Company && Company !== '')
        )
    }, [])

    const handleSubmit = useCallback(
        async (
            values: FilterData,
            { setValues }: FormikHelpers<FilterData>,
        ) => {
            // Update Redux state
            dispatch(setSearch({ key: 'Name', value: values.Name ?? '' }))
            dispatch(
                setSearch({
                    key: 'Ingredient',
                    value: values.Ingredient ?? '',
                }),
            )
            dispatch(setSearch({ key: 'Company', value: values.Company ?? '' }))

            // Update table data and fetch
            dispatch(setTableData({ page: 1, pageSize: metadata.pageSize }))

            try {
                await dispatch(
                    getDrugsSearch({
                        page: 1,
                        pageSize: metadata.pageSize,
                        Name: values.Name || undefined,
                        Ingredient: values.Ingredient || undefined,
                        Company: values.Company || undefined,
                    }),
                )
            } catch (error) {
                console.error('Error searching drugs:', error)
            }

            // Update form values to maintain consistency
            setValues(values)
            onFilterComplete?.()
        },
        [dispatch, metadata.pageSize, onFilterComplete],
    )

    const handleReset = useCallback(
        async (setValues: (values: FilterData) => void) => {
            setIsReset(true)

            const resetValues: FilterData = {
                Name: null,
                Ingredient: null,
                Company: null,
            }
            setValues(resetValues)

            // Update Redux state
            dispatch(setSearch({ key: 'Name', value: '' }))
            dispatch(setSearch({ key: 'Ingredient', value: '' }))
            dispatch(setSearch({ key: 'Company', value: '' }))

            // Update table data and fetch
            dispatch(setTableData({ page: 1, pageSize: metadata.pageSize }))

            try {
                await dispatch(
                    getDrugsSearch({
                        page: 1,
                        pageSize: metadata.pageSize,
                        Name: undefined,
                        Ingredient: undefined,
                        Company: undefined,
                    }),
                )
            } catch (error) {
                console.error('Error resetting drug search:', error)
            }

            setTimeout(() => setIsReset(false), 100)
            onFilterComplete?.()
        },
        [dispatch, metadata.pageSize, onFilterComplete],
    )

    // Prevent rerender when isReset changes
    const formikKey = isReset ? 'reset' : 'normal'

    return (
        <div className="mb-4">
            <Formik
                key={formikKey}
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={filterValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setValues, submitForm }) => {
                    const hasFilters = hasActiveFilters(values)

                    return (
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
                                    <SearchField
                                        label={t(
                                            'views.drug.filter.fields.name',
                                        )}
                                        name="Name"
                                        placeholder={t(
                                            'views.drug.filter.fields.namePlaceholder',
                                        )}
                                    />
                                    <SearchField
                                        label={t(
                                            'views.drug.filter.fields.ingredient',
                                        )}
                                        name="Ingredient"
                                        placeholder={t(
                                            'views.drug.filter.fields.ingredientPlaceholder',
                                        )}
                                    />
                                    <SearchField
                                        label={t(
                                            'views.drug.filter.fields.company',
                                        )}
                                        name="Company"
                                        placeholder={t(
                                            'views.drug.filter.fields.companyPlaceholder',
                                        )}
                                    />
                                </div>
                                <FormButtons
                                    hasActiveFilters={hasFilters}
                                    loading={loading}
                                    onReset={() => handleReset(setValues)}
                                    t={t}
                                />
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default DrugTableSearchForm
