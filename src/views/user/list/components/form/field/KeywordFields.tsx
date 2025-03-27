import { FormItem, Input } from '@/components/ui'
import { Field, type FieldInputProps } from 'formik'
import { useTranslation } from 'react-i18next'

const KeywordFields = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            <FormItem label={t('views.user.list.form.fields.keyword.label')}>
                <Field name="keyword">
                    {({ field }: { field: FieldInputProps<string> }) => (
                        <Input
                            {...field}
                            type="text"
                            placeholder={t(
                                'views.user.list.form.fields.keyword.placeholder',
                            )}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default KeywordFields
