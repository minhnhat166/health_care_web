import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const BasicInfoSection = (props: any) => {
    const { t } = useTranslation()
    const { touched, errors, values } = props

    return (
        <>
            <FormItem
                label="User ID"
                invalid={errors.userId && touched.userId}
                errorMessage={errors.userId}
                className="col-span-2"
            >
                <Field
                    as={Input}
                    name="userId"
                    value={values.userId}
                    disabled
                    placeholder={t(
                        'views.user.components.form.userIdPlaceholder',
                    )}
                />
            </FormItem>
            <FormItem
                label="Name"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
                className="col-span-2"
            >
                <Field
                    as={Input}
                    name="name"
                    value={values.name}
                    placeholder={t(
                        'views.user.components.form.namePlaceholder',
                    )}
                />
            </FormItem>
            <FormItem label="Email" invalid={errors.email && touched.email}>
                <Field
                    as={Input}
                    name="email"
                    value={values.email}
                    placeholder={t(
                        'views.user.components.form.emailPlaceholder',
                    )}
                />
            </FormItem>
            <FormItem
                label="Phone Number"
                invalid={errors.phoneNumber && touched.phoneNumber}
                errorMessage={errors.phoneNumber}
            >
                <Field
                    as={Input}
                    name="phoneNumber"
                    value={values.phoneNumber}
                    placeholder={t(
                        'views.user.components.form.phoneNumberPlaceholder',
                    )}
                />
            </FormItem>
            <FormItem
                label="Role"
                invalid={errors.role && touched.role}
                errorMessage={errors.role}
            >
                <Field
                    as={Input}
                    name="role"
                    value={values.role}
                    placeholder={t(
                        'views.user.components.form.rolePlaceholder',
                    )}
                />
            </FormItem>
        </>
    )
}

export default memo(BasicInfoSection)
