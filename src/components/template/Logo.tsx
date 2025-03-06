import type { CommonProps } from '@/@types/common'
import { APP_NAME } from '@/constants/app.constant'
import classNames from 'classnames'
import { memo } from 'react'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline' | 'icon'
    mode?: 'light' | 'dark'
    textColor?: string
    imgClass?: string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        textColor = 'black',
        className,
        imgClass,
        style,
    } = props

    const logoSrc = `${LOGO_SRC_PATH}logo-${mode}-${type}.png`

    return (
        <div className={classNames('logo', className)} style={style}>
            <div className="flex flex-row justify-center items-center gap-1">
                <img
                    className={classNames('image w-auto h-32', imgClass)}
                    src={logoSrc}
                    alt={`${APP_NAME} logo`}
                />
            </div>
        </div>
    )
}

export default memo(Logo)
