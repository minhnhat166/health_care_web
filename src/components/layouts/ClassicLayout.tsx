import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import View from '@/views'
import React, { memo } from 'react'

const HeaderActionsStart = memo(() => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
})

const HeaderActionsEnd = memo(() => {
    return (
        <>
            <SidePanel />
            <UserDropdown hoverable={false} />
        </>
    )
})

const ClassicLayout: React.FC = () => {
    return (
        <div className="app-layout-classic flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <main className="h-full flex flex-auto flex-col">
                        <View />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default memo(ClassicLayout)
