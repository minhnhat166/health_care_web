import { AdaptableCard, Affix } from '@/components/shared'
import { injectReducer } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import { useTranslation } from 'react-i18next'
import CreateButton from './components/button/CreateButton'
import DrugTable from './components/table/DrugTable'
import DrugTableRefreshButton from './components/table/DrugTableRefreshButton'
import reducer, { SLICE_NAME } from './store'
import DrugTableTools from './components/table/DrugTableTools'

injectReducer(SLICE_NAME, reducer)

function DrugList() {
    const { t } = useTranslation()
    const { larger } = useResponsive()

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <div className="xl:col-span-4">
                    <div className="flex justify-between items-center space-x-2">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3>{t('views.drug.title')}</h3>
                            <DrugTableRefreshButton />
                        </div>
                        {/* If screen smaller than 1280 */}
                        {!larger.xl && <DrugTableTools />}
                        <div className="space-x-4 flex flex-wrap items-center justify-end md:justify-start">
                            <CreateButton />
                        </div>
                    </div>
                    <DrugTable />
                </div>
                <div className="hidden xl:block">
                    <Affix
                        offset={80}
                        className="border border-y-0 border-r-0 p-4"
                    >
                        <h6 className="text-gray-900 uppercase tracking-wide font-semibold mb-3 text-sm lg:text-xs">
                            {t('views.drug.filter.title')}
                        </h6>
                        <DrugTableTools />
                    </Affix>
                </div>
            </div>
        </AdaptableCard>
    )
}
export default DrugList
