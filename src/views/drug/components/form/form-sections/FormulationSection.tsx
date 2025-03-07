import { FormItem, Input, Select } from '@/components/ui'
import { Field } from 'formik'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const FormulationSection = (props: any) => {
    const { t } = useTranslation()
    const { touched, errors } = props

    const drugClassifications = [
        {
            value: 'Thuốc kê đơn',
            label: t('views.drug.classifications.prescription'),
        },
        {
            value: 'Thuốc không kê đơn',
            label: t('views.drug.classifications.otc'),
        },
        {
            value: 'Chất kiểm soát',
            label: t('views.drug.classifications.controlled'),
        },
    ]

    return (
        <>
            <FormItem
                label={t('views.drug.fields.activeIngredients')}
                invalid={errors.hoatChat && touched.hoatChat}
                errorMessage={errors.hoatChat}
                className="col-span-2"
            >
                <Field name="hoatChat">
                    {({ field }: any) => (
                        <Input
                            textArea
                            {...field}
                            placeholder={t(
                                'views.drug.placeholders.activeIngredients',
                            )}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={t('views.drug.fields.classification')}
                invalid={errors.phanLoai && touched.phanLoai}
                errorMessage={errors.phanLoai}
            >
                <Field name="phanLoai">
                    {({ field, form }: any) => (
                        <Select
                            field={field}
                            form={form}
                            options={drugClassifications}
                            value={
                                drugClassifications.find(
                                    (option) => option.value === field.value,
                                ) || field.value
                            }
                            onChange={(option) =>
                                form.setFieldValue(
                                    field.name,
                                    option?.value || '',
                                )
                            }
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={t('views.drug.fields.concentration')}
                invalid={errors.nongDo && touched.nongDo}
                errorMessage={errors.nongDo}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nongDo"
                    placeholder={t('views.drug.placeholders.concentration')}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.excipients')}
                invalid={errors.taDuoc && touched.taDuoc}
                errorMessage={errors.taDuoc}
                className="col-span-2"
            >
                <Field name="taDuoc">
                    {({ field }: any) => (
                        <Input
                            textArea
                            {...field}
                            placeholder={t(
                                'views.drug.placeholders.excipients',
                            )}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={t('views.drug.fields.packaging')}
                invalid={errors.dongGoi && touched.dongGoi}
                errorMessage={errors.dongGoi}
                className="col-span-2"
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="dongGoi"
                    placeholder={t('views.drug.placeholders.packaging')}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.standards')}
                invalid={errors.tieuChuan && touched.tieuChuan}
                errorMessage={errors.tieuChuan}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="tieuChuan"
                    placeholder={t('views.drug.placeholders.standards')}
                    component={Input}
                />
            </FormItem>
        </>
    )
}

export default memo(FormulationSection)
