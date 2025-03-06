import useToast from '@/utils/useToast'
import {
    flip,
    offset,
    shift,
    useFloating,
    useHover,
    useInteractions,
} from '@floating-ui/react'
import { useMemo, useState, useCallback } from 'react'

interface ContentCellProps {
    content: string | number | null | undefined
    maxLength?: number
}

const ContentCell = ({ content, maxLength = 13 }: ContentCellProps) => {
    const contentString =
        content !== undefined && content !== null ? String(content) : ''

    // Early return for empty content
    if (!content && content !== 0) {
        return <span className="block">-</span>
    }

    const [isOpen, setIsOpen] = useState(false)

    const toast = useToast()

    // Memoize truncated content
    const truncatedContent = useMemo(
        () =>
            contentString.length > maxLength
                ? contentString.substring(0, maxLength) + '...'
                : contentString,
        [contentString, maxLength],
    )

    const needsTruncation = contentString.length > maxLength

    const { refs, floatingStyles, context } = useFloating({
        placement: 'top',
        middleware: [offset(6), flip(), shift()],
        open: isOpen,
        onOpenChange: setIsOpen,
    })

    const hover = useHover(context, {
        handleClose: null,
        delay: 200,
    })

    const { getReferenceProps, getFloatingProps } = useInteractions([hover])

    const handleCopy = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            navigator.clipboard
                .writeText(contentString)
                .then(() => {
                    toast({
                        type: 'success',
                        children: 'Copied!',
                    })
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err)
                    toast({
                        type: 'danger',
                        children: 'Failed to copy text',
                    })
                })
        },
        [contentString, toast],
    )

    return (
        <div className="relative">
            <span
                ref={needsTruncation ? refs.setReference : undefined}
                {...(needsTruncation ? getReferenceProps() : {})}
                className={`block w-[110px] cursor-pointer rounded ${needsTruncation ? 'truncate' : ''}`}
                onClick={handleCopy}
                title={needsTruncation ? 'Click to copy' : undefined}
                aria-label={
                    needsTruncation
                        ? `Full content: ${contentString}`
                        : undefined
                }
            >
                {needsTruncation ? truncatedContent : contentString}
            </span>
            {isOpen && needsTruncation && (
                <div
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                    style={floatingStyles}
                    className="bg-gray-900 text-white p-2 rounded shadow-lg max-w-xs z-50"
                    role="tooltip"
                >
                    {contentString}
                </div>
            )}
        </div>
    )
}

export default ContentCell
