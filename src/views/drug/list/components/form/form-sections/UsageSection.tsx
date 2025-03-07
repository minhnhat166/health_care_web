import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const UsageSection = (props: any) => {
    const { t } = useTranslation()
    const { touched, errors } = props

    return (
        <>
            <FormItem
                label={t('views.drug.fields.usageInstructions')}
                invalid={errors.huongDanSuDung && touched.huongDanSuDung}
                errorMessage={errors.huongDanSuDung}
                className="col-span-2"
            >
                <Field name="huongDanSuDung">
                    {({ field }: any) => (
                        <Input
                            textArea
                            {...field}
                            placeholder={t(
                                'views.drug.placeholders.usageInstructions',
                            )}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={t('views.drug.fields.patientUsageInstructions')}
                invalid={errors.huongDanSuDungBn && touched.huongDanSuDungBn}
                errorMessage={errors.huongDanSuDungBn}
                className="col-span-2"
            >
                <Field name="huongDanSuDungBn">
                    {({ field }: any) => (
                        <Input
                            textArea
                            {...field}
                            placeholder={t(
                                'views.drug.placeholders.patientUsageInstructions',
                            )}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={t('views.drug.fields.dosageForm')}
                invalid={errors.baoChe && touched.baoChe}
                errorMessage={errors.baoChe}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="baoChe"
                    placeholder={t('views.drug.placeholders.dosageForm')}
                    component={Input}
                />
            </FormItem>
        </>
    )
}

export default memo(UsageSection)
