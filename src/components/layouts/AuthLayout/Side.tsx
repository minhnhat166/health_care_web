import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import { cloneElement, memo } from 'react'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    const currentYear = new Date().getFullYear()

    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat bg-cover py-6 px-8 lg:px-16 flex-col justify-between hidden lg:flex"
                style={{
                    backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
                }}
            >
                <Logo mode="light" type="icon" />
                <div>{/* Brand content can be added here if needed */}</div>
                <span className="text-white">
                    Copyright &copy; {currentYear}{' '}
                    <span className="font-semibold">{APP_NAME}</span>{' '}
                </span>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
                    <div className="mb-8">{content}</div>
                    {children &&
                        cloneElement(children as React.ReactElement, rest)}
                </div>
            </div>
        </div>
    )
}

export default memo(Side)
