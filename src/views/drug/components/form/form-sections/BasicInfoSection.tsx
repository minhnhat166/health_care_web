import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const BasicInfoSection = (props: any) => {
    const { t } = useTranslation()
    const { touched, errors, values } = props
    console.log('🚀 ~ BasicInfoSection ~ values:', values)

    return (
        <>
            <FormItem
                label={t('views.drug.fields.drugName')}
                invalid={errors.tenThuoc && touched.tenThuoc}
                errorMessage={errors.tenThuoc}
                className="col-span-2"
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="tenThuoc"
                    placeholder={t('views.drug.placeholders.drugName')}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.images')}
                invalid={errors.images && touched.images}
                errorMessage={errors.images}
                className="col-span-2"
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="images"
                    placeholder={t('views.drug.placeholders.images')}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.rate')}
                invalid={errors.rate && touched.rate}
                errorMessage={errors.rate}
            >
                <Field
                    type="number"
                    autoComplete="off"
                    name="rate"
                    placeholder={t('views.drug.placeholder.rate')}
                    component={Input}
                />
            </FormItem>
        </>
    )
}

export default memo(BasicInfoSection)
