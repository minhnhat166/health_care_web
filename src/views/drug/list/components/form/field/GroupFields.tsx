import { FormItem, Select } from '@/components/ui'
import { Field, useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'

interface FormValues {
    Group: string | null
}

const GroupFields = () => {
    const { t } = useTranslation()
    const { setFieldValue } = useFormikContext<FormValues>()

    const groupOptions = [
        {
            value: '',
            label: t('views.drug.filter.group.options.all'),
        },
        {
            value: 'TanDuoc',
            label: t('views.drug.filter.group.options.tanDuoc'),
        },
        {
            value: 'DongDuoc',
            label: t('views.drug.filter.group.options.dongDuoc'),
        },
    ]

    return (
        <div className="space-y-4">
            <FormItem label={t('views.drug.filter.group.label')}>
                <Field name="Group">
                    {({ field }: any) => (
                        <Select
                            value={
                                groupOptions.find(
                                    (option) => option.value === field.value,
                                ) || groupOptions[0]
                            }
                            options={groupOptions}
                            onChange={(option) => {
                                setFieldValue('Group', option?.value || '')
                            }}
                            placeholder={t(
                                'views.drug.filter.group.placeholder',
                            )}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default GroupFields
