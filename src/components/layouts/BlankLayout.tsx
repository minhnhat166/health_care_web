import SidePanel from '@/components/template/SidePanel'
import { setPanelExpand, useAppDispatch, useAppSelector } from '@/store'
import View from '@/views'
import classNames from 'classnames'
import { memo, useMemo } from 'react'
import { HiOutlineCog } from 'react-icons/hi'

const ConfiguratorToggle = memo(() => {
    const dispatch = useAppDispatch()
    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )

    const toggleClass = useMemo(
        () =>
            classNames(
                'fixed ltr:right-0 rtl:left-0 top-96 p-3 ltr:rounded-tl-md ltr:rounded-bl-md rtl:rounded-tr-md rtl:rounded-br-md text-white text-xl cursor-pointer select-none',
                `bg-${themeColor}-${primaryColorLevel}`,
            ),
        [themeColor, primaryColorLevel],
    )

    const handleToggle = () => {
        dispatch(setPanelExpand(true))
    }

    return (
        <div className={toggleClass} onClick={handleToggle}>
            <HiOutlineCog />
        </div>
    )
})

ConfiguratorToggle.displayName = 'ConfiguratorToggle'

const BlankLayout = () => {
    return (
        <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
            <View />
            <ConfiguratorToggle />
            <SidePanel className="hidden" />
        </div>
    )
}

export default memo(BlankLayout)
