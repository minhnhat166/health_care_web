import type { MedicationItem } from '@/utils/hooks/useDashboardData'
import React from 'react'

interface SummaryCardsProps {
    totalPrescriptions: number
    totalUsers: number
    totalMedications: number
    totalCompanies: number
    popularMedication: MedicationItem
    loading?: boolean
    trends?: {
        prescriptions?: number
        users?: number
        medications?: number
        companies?: number
    }
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
    totalPrescriptions,
    totalUsers,
    totalMedications,
    totalCompanies,
    popularMedication,
    loading = false,
    trends = {},
}) => {
    const renderTrend = (value?: number) => {
        if (value === undefined) return null

        const isPositive = value >= 0
        return (
            <div
                className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}
            >
                {isPositive ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
                {Math.abs(value)}%
            </div>
        )
    }

    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1 font-medium">
                            Total Prescriptions
                        </p>
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {totalPrescriptions}
                                </h2>
                                {renderTrend(trends.prescriptions)}
                            </>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                </div>
            </div> */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1 font-medium">
                            Total Users
                        </p>
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {totalUsers}
                                </h2>
                                {renderTrend(trends.users)}
                            </>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                stroke="currentColor"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1 font-medium">
                            Total Medications
                        </p>
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {totalMedications}
                                </h2>
                                {renderTrend(trends.medications)}
                            </>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1 font-medium">
                            Total Companies
                        </p>
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {totalCompanies}
                                </h2>
                                {renderTrend(trends.companies)}
                            </>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1 font-medium">
                            Most Popular
                        </p>
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {popularMedication.name}
                                </h3>
                                {/* <p className="text-sm text-gray-600 mt-1">
                                    {popularMedication.count} prescriptions
                                </p> */}
                            </>
                        )}
                    </div>
                    <div className="min-w-12 min-h-12 rounded-full bg-pink-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-pink-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryCards
