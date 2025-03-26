import { Field } from 'formik'
import { useTranslation } from 'react-i18next'
import { FormItem, FormContainer, Select, Checkbox } from '@/components/ui'

const StatusSection = (props: any) => {
    const { t } = useTranslation()
    const { touched, errors } = props

    const stateOptions = [
        { value: 202, label: '202' },
        { value: 404, label: '404' },
        { value: 500, label: '500' },
    ]

    return (
        <FormContainer className="col-span-2">
            <h5 className="mb-4">
                {t('views.drug.components.form.statusSection.title')}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label={t(
                        'views.drug.components.form.statusSection.state',
                        'State',
                    )}
                    invalid={(errors.state && touched.state) as boolean}
                    errorMessage={errors.state as string}
                >
                    <Field name="state">
                        {({ field, form }: any) => {
                            return (
                                <Select
                                    placeholder={t(
                                        'views.drug.components.form.statusSection.selectState',
                                        'Select state',
                                    )}
                                    options={stateOptions}
                                    value={stateOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        form.setFieldValue(
                                            field.name,
                                            option?.value || '',
                                        )
                                    }
                                />
                            )
                        }}
                    </Field>
                </FormItem>
                <FormItem
                    label={t('views.drug.components.form.statusSection.isHide')}
                >
                    <Field name="isHide">
                        {({ field, form }: any) => (
                            <Checkbox
                                checked={field.value}
                                onChange={(value) =>
                                    form.setFieldValue(field.name, value)
                                }
                            >
                                {t(
                                    'views.drug.components.form.statusSection.hideFromResults',
                                    'Hide from results',
                                )}
                            </Checkbox>
                        )}
                    </Field>
                </FormItem>
            </div>
        </FormContainer>
    )
}

export default StatusSection
