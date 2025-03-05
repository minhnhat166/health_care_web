import { cloneElement } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Logo from '@/components/template/Logo'
import type { ReactNode, ReactElement, PropsWithChildren } from 'react'
import type { CommonProps } from '@/@types/common'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({
    children,
    content,
    ...rest
}: PropsWithChildren<SimpleProps>) => {
    return (
        <div className="h-full w-full">
            <div className="flex flex-col flex-auto items-center justify-center min-w-0 w-full h-full relative bg-[url('/img/others/auth-side-bg.jpg')] bg-cover">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
                <Card
                    className="w-[90%] sm:w-[400px] md:w-[450px] lg:w-[500px] max-w-full max-h-screen relative z-10"
                    bodyClass="p-4 sm:p-6 md:p-8"
                >
                    <div className="text-center">
                        <Logo
                            type="icon"
                            imgClass="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                        />
                    </div>
                    <div className="text-center space-y-2 sm:space-y-3">
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                  contentClassName: 'text-center',
                                  ...rest,
                              })
                            : null}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Simple
