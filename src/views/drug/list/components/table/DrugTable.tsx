import { DataTable, type DataTableResetHandle } from '@/components/shared'
import { useAppDispatch } from '@/store'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useMemo, useRef } from 'react'
import { getApiDrugs, setTableData, useAppSelector } from '../../store'
import DrugColumns from '../columns/DrugColumns'

const DrugTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    // const initialLoadRef = useRef(true)

    const dispatch = useAppDispatch()
    // state
    const { page, pageSize, totalElement } = useAppSelector(
        (state) => state.drug.items.metadata,
    )
    const data = useAppSelector((state) => state.drug.items.result)
    const loading = useAppSelector((state) => state.drug.items.loading)

    // columns
    const columns = DrugColumns(page, pageSize)

    // memo
    const tableData = useMemo(
        () => ({ page, pageSize, totalElement }),
        [page, pageSize, totalElement],
    )

    // functions
    const fetchData = (currentPage: number, pageSize: number) => {
        dispatch(getApiDrugs({ page: currentPage, pageSize }))
    }

    const onPaginationChange = (newPage: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.page = newPage
        dispatch(setTableData(newTableData))
        if (newTableData) fetchData(newPage, pageSize)
    }

    const onSelectChange = (value: number) => {
        const newLimit = Number(value)
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = newLimit
        newTableData.page = 1
        dispatch(setTableData(newTableData))
        if (newTableData) fetchData(1, newLimit)
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize])

    return (
        <DataTable
            ref={tableRef}
            columns={columns}
            data={data}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ className: 'rounded-md' }}
            loading={loading}
            pagingData={{
                total: tableData.totalElement as number,
                pageIndex: tableData.page as number,
                pageSize: tableData.pageSize as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
        />
    )
}
export default DrugTable
