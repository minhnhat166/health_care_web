import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import { useTranslation } from 'react-i18next'
import DrugTable from './components/table/DrugTable'
import DrugTableRefreshButton from './components/table/DrugTableRefreshButton'
import reducer, { SLICE_NAME } from './store'

injectReducer(SLICE_NAME, reducer)

function DrugList() {
    const { t } = useTranslation()

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <div className="xl:col-span-4">
                    <div className="flex justify-between items-center space-x-2">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3>{t('views.drug.title')}</h3>
                            <DrugTableRefreshButton />
                        </div>
                        <div className="space-x-4 flex flex-wrap items-center justify-end md:justify-start">
                            {/* <GenerateQRBoxButton /> */}
                            {/* <ActionQRBoxButton /> */}
                        </div>
                    </div>
                    <DrugTable />
                </div>
            </div>
        </AdaptableCard>
    )
}
export default DrugList
