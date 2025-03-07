import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const ManufacturerSection = (props: any) => {
    const { t } = useTranslation()
    const { touched, errors } = props

    return (
        <>
            <FormItem
                label={t('views.drug.fields.manufacturer')}
                invalid={errors.congTySx && touched.congTySx}
                errorMessage={errors.congTySx}
                className="col-span-2"
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="congTySx"
                    placeholder={t('views.drug.placeholders.manufacturer')}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.manufacturerCode')}
                invalid={errors.congTySxCode && touched.congTySxCode}
                errorMessage={errors.congTySxCode}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="congTySxCode"
                    placeholder={t('views.drug.placeholders.manufacturerCode')}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.countryOfManufacture')}
                invalid={errors.nuocSx && touched.nuocSx}
                errorMessage={errors.nuocSx}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nuocSx"
                    placeholder={t(
                        'views.drug.placeholders.countryOfManufacture',
                    )}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.manufacturingAddress')}
                invalid={errors.diaChiSx && touched.diaChiSx}
                errorMessage={errors.diaChiSx}
                className="col-span-2"
            >
                <Field name="diaChiSx">
                    {({ field }: any) => (
                        <Input
                            textArea
                            {...field}
                            placeholder={t(
                                'views.drug.placeholders.manufacturingAddress',
                            )}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={t('views.drug.fields.shelfLife')}
                invalid={errors.tuoiTho && touched.tuoiTho}
                errorMessage={errors.tuoiTho}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="tuoiTho"
                    placeholder={t('views.drug.placeholders.shelfLife')}
                    component={Input}
                />
            </FormItem>
        </>
    )
}

export default memo(ManufacturerSection)
