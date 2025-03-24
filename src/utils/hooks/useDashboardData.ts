import { useAppDispatch } from '@/store'
import { useAppSelector } from '@/views/dashboard/store'
import {
    getCompanyList,
    getDrugList,
    getDrugTopSearchedList,
    getUserList,
} from '@/views/dashboard/store/DashboardSlice'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'

export interface MedicationItem {
    name: string
    count: number
    company: string
    searchCount?: number
}

export const useDashboardData = () => {
    const dispatch = useAppDispatch()
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

    const {
        totalUser,
        totalDrug,
        totalCompany,
        mostPopularDrug,
        mostPopularDrugs,
        loading,
        error,
    } = useAppSelector((state) => state.dashboard.items)

    const medicationData = useMemo(
        () =>
            (mostPopularDrugs || []).map((drug) => ({
                name: drug.tenThuoc || '',
                count: drug.searchCount || 0,
                company: drug.congTySx || '',
                searchCount: drug.searchCount || 0,
            })),
        [mostPopularDrugs],
    )

    const totalUsers = useMemo(() => totalUser || 0, [totalUser])
    const totalMedications = useMemo(() => totalDrug || 0, [totalDrug])
    const totalCompanies = useMemo(() => totalCompany || 0, [totalCompany])

    const popularMedication = useMemo(
        () =>
            mostPopularDrug
                ? {
                      name: mostPopularDrug.tenThuoc || '',
                      count: mostPopularDrug.searchCount || 0,
                      company: mostPopularDrug.congTySx || '',
                      searchCount: mostPopularDrug.searchCount || 0,
                  }
                : { name: '', count: 0, company: '' },
        [mostPopularDrug],
    )

    const totalPrescriptions = useMemo(
        () =>
            (mostPopularDrugs || []).reduce(
                (sum, drug) => sum + (drug.searchCount || 0),
                0,
            ),
        [mostPopularDrugs],
    )

    const isFetchingRef = useRef(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchDashboardData = useCallback(async () => {
        if (isFetchingRef.current) return

        try {
            isFetchingRef.current = true
            setIsLoading(true)
            await Promise.all([
                dispatch(getUserList({ page: 1, pageSize: 10 })),
                dispatch(getDrugList({ page: 1, pageSize: 10 })),
                dispatch(getCompanyList()),
                dispatch(getDrugTopSearchedList()),
            ])

            setLastUpdated(new Date())
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
        } finally {
            isFetchingRef.current = false
            setIsLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    return {
        medicationData,
        totalPrescriptions,
        totalUsers,
        totalMedications,
        totalCompanies,
        popularMedication,
        loading: loading || isLoading,
        error,
        refreshData: fetchDashboardData,
        lastUpdated,
    }
}
