import { FormItem, Input } from '@/components/ui'
import { Field, useFormikContext } from 'formik'
import { FilterData } from '../QRBoxTableFilterForm'
import { useTranslation } from 'react-i18next'

const ValueFields = () => {
    const { setFieldValue } = useFormikContext<FilterData>()
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            <FormItem
                label={t(
                    'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.valueField.label',
                )}
            >
                <Field name="value">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {({ field }: any) => (
                        <Input
                            {...field}
                            placeholder={t(
                                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.valueField.placeholder',
                            )}
                            onChange={(e) => {
                                const value = e.target.value
                                setFieldValue('value', value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default ValueFields
