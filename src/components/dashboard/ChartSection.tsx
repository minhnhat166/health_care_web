import { getBarChartOptions, getPieChartOptions } from '@/config/chartConfig'
import type { MedicationItem } from '@/utils/hooks/useDashboardData'
import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

interface ChartSectionProps {
    medicationData: MedicationItem[]
    loading?: boolean
}

const ChartSection: React.FC<ChartSectionProps> = ({
    medicationData,
    loading = false,
}) => {
    const { t } = useTranslation()
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar')

    const barChartOptions = getBarChartOptions(medicationData)
    const pieChartOptions = getPieChartOptions(medicationData)

    const barChartSeries = [
        {
            name: 'Prescriptions',
            data: medicationData.map((item) => item.count),
        },
    ]

    const pieChartSeries = medicationData.map((item) => item.count)

    const handleChartTypeChange = (type: 'bar' | 'line') => {
        setChartType(type)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        {t('views.dashboard.prescriptionDistribution')}
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleChartTypeChange('bar')}
                            className={`px-3 py-1 text-sm rounded-md ${
                                chartType === 'bar'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {t('views.dashboard.bar')}
                        </button>
                        <button
                            onClick={() => handleChartTypeChange('line')}
                            className={`px-3 py-1 text-sm rounded-md ${
                                chartType === 'line'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {t('views.dashboard.line')}
                        </button>
                    </div>
                </div>
                <div className="h-80 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : null}
                    <ReactApexChart
                        options={barChartOptions}
                        series={barChartSeries}
                        type={chartType}
                        height="100%"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        />
                    </svg>
                    {t('views.dashboard.favoriteMedications')}
                </h3>
                <div className="h-80 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : null}
                    <ReactApexChart
                        options={pieChartOptions}
                        series={pieChartSeries}
                        type="pie"
                        height="100%"
                    />
                </div>
            </div>
        </div>
    )
}

export default ChartSection
