import { FormItem, Select } from '@/components/ui'
import { Field, useFormikContext, type FieldInputProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { FilterData } from '../DrugTableFilterForm'
import type { SingleValue } from 'react-select'

interface StatusOption {
    value: string | null
    label: string
}

const StatusFields = () => {
    const { setFieldValue } = useFormikContext<FilterData>()
    const { t } = useTranslation()
    const options = [
        {
            value: '',
            label: t('views.drug.filter.status.options.all'),
        },
        {
            value: 'Created',
            label: t('views.drug.filter.status.options.created'),
        },
        {
            value: 'Approved',
            label: t('views.drug.filter.status.options.approved'),
        },
        {
            value: 'Updated',
            label: t('views.drug.filter.status.options.updated'),
        },
        {
            value: 'Inactive',
            label: t('views.drug.filter.status.options.inactive'),
        },
    ]

    return (
        <div className="space-y-4">
            <FormItem label={t('views.drug.filter.status.label')}>
                <Field name="Status">
                    {({ field }: { field: FieldInputProps<string | null> }) => (
                        <Select
                            {...field}
                            size="sm"
                            options={options}
                            value={
                                options.find(
                                    (option) => option.value === field?.value,
                                ) || options[0]
                            }
                            placeholder={t(
                                'views.drug.filter.status.placeholder',
                            )}
                            onChange={(newValue: SingleValue<StatusOption>) => {
                                const value =
                                    newValue?.value === null
                                        ? ''
                                        : (newValue?.value ?? '')
                                setFieldValue('Status', value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default StatusFields
