import { FormItem, Select } from '@/components/ui'
import { Field, useFormikContext, type FieldInputProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { FilterData } from '../QRBoxTableFilterForm'
import type { SingleValue } from 'react-select'

const StatusFields = () => {
    const { setFieldValue } = useFormikContext<FilterData>()
    const { t } = useTranslation()
    const options = [
        {
            value: -1,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.statusField.options.all',
            ),
        },
        {
            value: 0,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.statusField.options.offline',
            ),
        },
        {
            value: 1,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.statusField.options.online',
            ),
        },
        {
            value: 2,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.statusField.options.create',
            ),
        },
        {
            value: 3,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.statusField.options.unknown',
            ),
        },
    ]

    return (
        <div className="space-y-4">
            <FormItem
                label={t(
                    'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.statusField.label',
                )}
            >
                <Field name="status">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {({ field }: { field: FieldInputProps<number> }) => (
                        <Select
                            {...field}
                            size="sm"
                            options={options}
                            value={
                                options.find(
                                    (option) =>
                                        option.value === (field?.value ?? null),
                                ) || options[0] // default value is 'Tất Cả'
                            }
                            placeholder={t(
                                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.statusField.placeholder',
                            )}
                            onChange={(
                                newValue: SingleValue<{
                                    value: number
                                    label: string
                                }>,
                            ) => {
                                if (newValue) {
                                    setFieldValue('status', newValue.value)
                                }
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default StatusFields
