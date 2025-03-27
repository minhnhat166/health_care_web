import { AdaptableCard, Affix } from '@/components/shared'
import { injectReducer } from '@/store'
import { useTranslation } from 'react-i18next'
import UserListTable from './components/table/UserListTable'
import UserListTableRefreshButton from './components/table/UserListTableRefreshButton'
import reducer, { SLICE_NAME } from './store'
import UserTableTools from './components/table/UserListTableTools'
import useResponsive from '@/utils/hooks/useResponsive'

injectReducer(SLICE_NAME, reducer)

function UserList() {
    const { t } = useTranslation()
    const { larger } = useResponsive()

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <div className="xl:col-span-4">
                    <div className="flex justify-between items-center space-x-2">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3>{t('views.user.title')}</h3>
                            <UserListTableRefreshButton />
                        </div>
                        {!larger.xl && <UserTableTools />}
                        <div className="space-x-4 flex flex-wrap items-center justify-end md:justify-start">
                            {/* <GenerateQRBoxButton /> */}
                            {/* <ActionQRBoxButton /> */}
                        </div>
                    </div>
                    <UserListTable />
                </div>
                <div className="hidden xl:block">
                    <Affix
                        offset={80}
                        className="border border-y-0 border-r-0 p-4"
                    >
                        <h6 className="text-gray-900 uppercase tracking-wide font-semibold mb-3 text-sm lg:text-xs">
                            {t('views.drug.filter.title')}
                        </h6>
                        <UserTableTools />
                    </Affix>
                </div>
            </div>
        </AdaptableCard>
    )
}
export default UserList
