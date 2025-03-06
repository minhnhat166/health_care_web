import Header from '@/components/template/Header'
import HeaderLogo from '@/components/template/HeaderLogo'
import MobileNav from '@/components/template/MobileNav'
import SecondaryHeader from '@/components/template/SecondaryHeader'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import View from '@/views'
import { memo } from 'react'

const HeaderActionsStart = memo(() => (
    <>
        <HeaderLogo />
        <MobileNav />
    </>
))

const HeaderActionsEnd = memo(() => (
    <>
        <SidePanel />
        <UserDropdown hoverable={false} />
    </>
))

// Add component name for better debugging
HeaderActionsStart.displayName = 'HeaderActionsStart'
HeaderActionsEnd.displayName = 'HeaderActionsEnd'

const DeckedLayout = () => {
    return (
        <div className="app-layout-simple flex flex-auto flex-col min-h-screen">
            <div className="flex flex-auto min-w-0">
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        container
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <SecondaryHeader contained />
                    <View pageContainerType="contained" />
                </div>
            </div>
        </div>
    )
}

export default memo(DeckedLayout)
