import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const RegistrationCompanySection = (props: any) => {
    const { t } = useTranslation()
    const { touched, errors } = props

    return (
        <>
            <FormItem
                label={t('views.drug.fields.registrant')}
                invalid={errors.congTyDk && touched.congTyDk}
                errorMessage={errors.congTyDk}
                className="col-span-2"
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="congTyDk"
                    placeholder={t('views.drug.placeholders.registrant')}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.countryOfRegistration')}
                invalid={errors.nuocDk && touched.nuocDk}
                errorMessage={errors.nuocDk}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nuocDk"
                    placeholder={t(
                        'views.drug.placeholders.countryOfRegistration',
                    )}
                    component={Input}
                />
            </FormItem>

            <FormItem
                label={t('views.drug.fields.registrationAddress')}
                invalid={errors.diaChiDk && touched.diaChiDk}
                errorMessage={errors.diaChiDk}
                className="col-span-2"
            >
                <Field name="diaChiDk">
                    {({ field }: any) => (
                        <Input
                            textArea
                            {...field}
                            placeholder={t(
                                'views.drug.placeholders.registrationAddress',
                            )}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={t('views.drug.fields.declaredPrice')}
                invalid={errors.giaKeKhai && touched.giaKeKhai}
                errorMessage={errors.giaKeKhai}
            >
                <Field
                    type="number"
                    autoComplete="off"
                    name="giaKeKhai"
                    placeholder={t('views.drug.placeholders.declaredPrice')}
                    component={Input}
                />
            </FormItem>
        </>
    )
}

export default memo(RegistrationCompanySection)
