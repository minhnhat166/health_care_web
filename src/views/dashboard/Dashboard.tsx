import ChartSection from '@/components/dashboard/ChartSection'
import MedicationList from '@/components/dashboard/MedicationList'
import SummaryCards from '@/components/dashboard/SummaryCards'
import { Loading } from '@/components/shared'
import { Button } from '@/components/ui'
import { injectReducer } from '@/store'
import { useDashboardData } from '@/utils/hooks/useDashboardData'
import reducer, { SLICE_NAME } from './store'

injectReducer(SLICE_NAME, reducer)

const Dashboard = () => {
    const {
        medicationData,
        totalPrescriptions,
        totalUsers,
        totalMedications,
        totalCompanies,
        popularMedication,
        loading,
        refreshData,
        lastUpdated,
    } = useDashboardData()

    const handleRefresh = () => {
        refreshData && refreshData()
    }

    if (loading) {
        return <Loading loading />
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-24 after:bg-purple-600 after:rounded-full">
                    Medication Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500">
                        Last updated: {lastUpdated.toLocaleString()}
                    </p>
                    <Button
                        onClick={handleRefresh}
                        variant="solid"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <span
                            className={
                                loading
                                    ? 'animate-spin inline-block'
                                    : 'inline-block'
                            }
                        >
                            ↻
                        </span>
                        Refresh
                    </Button>
                </div>
            </div>

            <SummaryCards
                totalPrescriptions={totalPrescriptions}
                totalUsers={totalUsers}
                totalMedications={totalMedications}
                totalCompanies={totalCompanies}
                popularMedication={popularMedication}
                loading={loading}
            />

            <ChartSection medicationData={medicationData} loading={loading} />

            <MedicationList medications={medicationData} />
        </div>
    )
}

export default Dashboard
