import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import Card from '@/components/ui/Card'
import type { PropsWithChildren, ReactElement, ReactNode } from 'react'
import { cloneElement, memo } from 'react'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const cardClasses =
    'w-[90%] sm:w-[400px] md:w-[450px] lg:w-[500px] max-w-full max-h-screen relative z-10'
const cardBodyClasses = 'p-4 sm:p-6 md:p-8'
const logoClasses =
    'mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28'

const Simple = memo(
    ({ children, content, ...rest }: PropsWithChildren<SimpleProps>) => {
        return (
            <div className="h-full w-full">
                <div className="flex flex-col flex-auto items-center justify-center min-w-0 w-full h-full relative bg-[url('/img/others/auth-side-bg.jpg')] bg-cover">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
                    <Card className={cardClasses} bodyClass={cardBodyClasses}>
                        <div className="text-center">
                            <Logo type="icon" imgClass={logoClasses} />
                        </div>
                        <div className="text-center space-y-2 sm:space-y-3">
                            {content}
                            {children && 'type' in (children as ReactElement)
                                ? cloneElement(children as ReactElement, {
                                      contentClassName: 'text-center',
                                      ...rest,
                                  })
                                : children}
                        </div>
                    </Card>
                </div>
            </div>
        )
    },
)

Simple.displayName = 'Simple'

export default Simple
