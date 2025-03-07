import { Checkbox } from '@/components/ui'
import { FieldProps } from 'formik'
import { memo } from 'react'

const CheckboxField = ({
    field,
    form,
    ...props
}: FieldProps & { [key: string]: any }) => {
    return (
        <Checkbox
            checked={field.value}
            onChange={field.onChange}
            name={field.name}
            {...props}
        />
    )
}

export default memo(CheckboxField)
