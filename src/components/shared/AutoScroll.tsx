import classNames from 'classnames'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface AutoScrollProps {
    children: ReactNode
    wrapperClassName?: string
    containerClassName?: string
    childClassName?: string
    title?: string
    items: any[]
    itemHeight?: number
    height?: string | number
    width?: string | number
    scrollDuration?: number
    direction?: 'vertical' | 'horizontal'
    overflow?: 'auto' | 'hidden' | 'scroll' | 'visible'
    infinite?: boolean
    onEndReached?: () => void
}

const AutoScroll = ({
    children,
    wrapperClassName,
    containerClassName,
    childClassName,
    title,
    items,
    itemHeight = 20, // itemHeight is used here to determine the scroll limit
    height = '100%',
    width = '100%',
    scrollDuration = 5000,
    direction = 'vertical',
    overflow = 'auto',
    infinite = true,
    onEndReached,
    ...rest
}: AutoScrollProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollTopRef = useRef(0)

    useEffect(() => {
        const { current } = containerRef
        if (!current) return

        const animateScroll = () => {
            scrollTopRef.current += 1
            if (scrollTopRef.current >= items.length * itemHeight) {
                if (infinite && onEndReached) onEndReached()
                scrollTopRef.current = 0
            }
            current.style.transform = `translate${direction === 'vertical' ? 'Y' : 'X'}(-${scrollTopRef.current}px)`
        }

        const intervalId = setInterval(animateScroll, scrollDuration)
        return () => clearInterval(intervalId)
    }, [
        items.length,
        itemHeight,
        scrollDuration,
        onEndReached,
        infinite,
        direction,
    ])

    const heightValue = typeof height === 'number' ? `${height}px` : height
    const widthValue = typeof width === 'number' ? `${width}px` : width

    const _containerClassName = classNames(`flex`, containerClassName, {
        'flex-col': direction === 'vertical',
        'flex-row': direction === 'horizontal',
        [`overflow-${overflow}`]: overflow,
    })

    const _childClassName = classNames('flex', childClassName, {
        'flex-col': direction === 'vertical',
        'flex-row': direction === 'horizontal',
    })

    return (
        // <div className={_wrapperClassName}>
        //     {title && (
        //         <h2 className="text-sm md:text-lg font-semibold md:whitespace-nowrap border-b">
        //             {title}
        //         </h2>
        //     )}
        <div className={_containerClassName} {...rest}>
            <div
                ref={containerRef}
                className={_childClassName}
                style={{ height: heightValue, width: widthValue }}
            >
                {children}
            </div>
        </div>
        // </div>
    )
}

export default AutoScroll
