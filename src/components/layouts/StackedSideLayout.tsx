import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import SidePanel from '@/components/template/SidePanel'
import StackedSideNav from '@/components/template/StackedSideNav'
import UserDropdown from '@/components/template/UserDropdown'
import View from '@/views'
import { memo } from 'react'

const HeaderActionsStart = memo(() => {
    return (
        <>
            <MobileNav />
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

const StackedSideLayout = () => {
    return (
        <div className="app-layout-stacked-side flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <StackedSideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <div className="h-full flex flex-auto flex-col">
                        <View />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(StackedSideLayout)
