import { FormItem, Select } from '@/components/ui'
import { Field, useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'

// Add proper typing for the form values if not already defined
interface FormValues {
    Category: string | null
}

const CategoryFields = () => {
    const { t } = useTranslation()
    const { setFieldValue } = useFormikContext<FormValues>()

    const categoryOptions = [
        {
            value: '',
            label: t('views.drug.filter.category.options.all'),
        },
        {
            value: 'ThuocKeDon',
            label: t('views.drug.filter.category.options.thuocKeDon'),
        },
        {
            value: 'ThuocKhongKeDon',
            label: t('views.drug.filter.category.options.thuocKhongKeDon'),
        },
    ]

    return (
        <div className="space-y-4">
            <FormItem label={t('views.drug.filter.category.label')}>
                <Field name="Category">
                    {({ field, form }: any) => (
                        <Select
                            value={
                                categoryOptions.find(
                                    (option) => option.value === field.value,
                                ) || categoryOptions[0]
                            }
                            options={categoryOptions}
                            onChange={(option) => {
                                setFieldValue('Category', option?.value || '')
                            }}
                            placeholder={t(
                                'views.drug.filter.category.placeholder',
                            )}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default CategoryFields
