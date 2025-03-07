import { memo } from 'react'

interface TextareaProps {
    field: any
    rows?: number
    placeholder?: string
    className?: string
}

const Textarea = ({
    field,
    rows = 3,
    placeholder,
    className = '',
}: TextareaProps) => (
    <textarea
        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        rows={rows}
        placeholder={placeholder}
        {...field}
    />
)

export default memo(Textarea)
