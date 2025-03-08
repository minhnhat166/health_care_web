import Header from '@/components/template/Header'
import LanguageSelector from '@/components/template/LanguageSelector'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import UserDropdown from '@/components/template/UserDropdown'
import View from '@/views'
import { memo } from 'react'

const HeaderActionsStart = memo(() => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
})

HeaderActionsStart.displayName = 'HeaderActionsStart'

const HeaderActionsEnd = memo(() => {
    return (
        <>
            <LanguageSelector />
            {/* <SidePanel /> */}
            <UserDropdown hoverable={false} />
        </>
    )
})

HeaderActionsEnd.displayName = 'HeaderActionsEnd'

const ModernLayout = () => {
    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    <Header
                        className="border-b border-gray-200 dark:border-gray-700"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />
                    <View />
                </div>
            </div>
        </div>
    )
}

export default memo(ModernLayout)
