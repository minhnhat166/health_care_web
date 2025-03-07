import { FormItem, Select } from '@/components/ui'
import { Field, useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { FilterData } from '../QRBoxTableFilterForm'
import { useAppSelector } from '../../../store'

const TypeFields = () => {
    const { setFieldValue } = useFormikContext<FilterData>()
    const { t } = useTranslation()
    const activeTab = useAppSelector((state) => state.QRBoxList.items.activeTab)
    const options = [
        {
            value: 9,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.typeField.options.all',
            ),
        },
        {
            value: 0,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.typeField.options.bankAccount',
            ),
        },
        {
            value: 1,
            label: t(
                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.typeField.options.serialNumber',
            ),
        },
        {
            value: 2,
            label:
                activeTab === 'voiceBox'
                    ? t(
                          'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.typeField.options.voiceBoxCode',
                      )
                    : t(
                          'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.typeField.options.payBoxCode',
                      ),
        },
    ]

    return (
        <div className="space-y-4">
            <FormItem
                label={t(
                    'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.typeField.label',
                )}
            >
                <Field name="type">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {({ field }: any) => (
                        <Select
                            {...field}
                            size="sm"
                            options={options}
                            value={
                                options.find(
                                    (option) =>
                                        option.value === (field?.value ?? null),
                                ) || options[2] // default value is 'Tất Cả'
                            }
                            placeholder={t(
                                'merchants.merchantDetail.views.qrBox.qrBoxList.components.form.fields.typeField.placeholder',
                            )}
                            onChange={(option: {
                                value: number
                                label: string
                            }) => {
                                setFieldValue('type', option.value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

export default TypeFields
