import { LAYOUT_TYPE_BLANK } from '@/constants/theme.constant'
import { RootState, useAppSelector } from '@/store'
import View from '@/views'
import { memo } from 'react'
import Simple from './Simple'

const selectLayoutType = (state: RootState): string => state.theme.layout.type

const AuthLayout = () => {
    const layoutType = useAppSelector(selectLayoutType)

    return (
        <div className="app-layout-blank flex flex-auto flex-col h-screen">
            {layoutType === LAYOUT_TYPE_BLANK ? (
                <View />
            ) : (
                <Simple>
                    <View />
                </Simple>
            )}
        </div>
    )
}

export default memo(AuthLayout)
