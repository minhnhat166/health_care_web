import { Loading, TableRowSkeleton } from '@/components/shared'
import type { CheckboxProps } from '@/components/ui/Checkbox'
import Checkbox from '@/components/ui/Checkbox'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import type { SkeletonProps } from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'
import useResponsive from '@/utils/hooks/useResponsive'
import {
    CellContext,
    ColumnDef,
    ColumnSort,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    useReactTable,
    type Column,
    type ColumnPinningState,
} from '@tanstack/react-table'
import classNames from 'classnames'
import type { ChangeEvent, CSSProperties, ForwardedRef } from 'react'
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import DoubleScrollTable from './DoubleScrollTable'

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

type DataTableScrollProps<T> = {
    columns: ColumnDef<T>[]
    data?: T[]
    loading?: boolean
    onCheckBoxChange?: (checked: boolean, row: T) => void
    onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
    onPaginationChange?: (page: number) => void
    onSelectChange?: (num: number) => void
    onSort?: (sort: OnSortParam) => void
    limits?: number[]
    pageSizes?: number[]
    selectable?: boolean
    skeletonAvatarColumns?: number[]
    skeletonAvatarProps?: SkeletonProps
    pagingData?: {
        total: number
        page: number
        limit: number
    }
    pagination?: React.ReactNode
    isSelectLimit?: boolean
    columnPinning?: ColumnPinningState
    onColumnPinningChange?: (columnPinning: ColumnPinningState) => void
    tableCompact?: boolean
}

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void
    indeterminate: boolean
    onCheckBoxChange?: (event: CheckBoxChangeEvent) => void
    onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
    const {
        indeterminate,
        onChange,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        ...rest
    } = props

    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate, rest.checked])

    const handleChange = useCallback(
        (e: CheckBoxChangeEvent) => {
            onChange(e)
            onCheckBoxChange?.(e)
            onIndeterminateCheckBoxChange?.(e)
        },
        [onChange, onCheckBoxChange, onIndeterminateCheckBoxChange],
    )

    return (
        <Checkbox
            ref={ref}
            className="mb-0"
            onChange={(_, e) => handleChange(e)}
            {...rest}
        />
    )
}

// Extract this function outside of the component to prevent recreation on each render
const getCommonPinningStyles = (
    column: Column<any, any>,
    isLoading?: boolean,
    table?: any,
): CSSProperties => {
    // Base styles for all columns
    const baseStyles: CSSProperties = {
        position: 'relative',
        width: column.getSize(),
    }

    // Don't apply pinning styles if loading
    if (isLoading) {
        return baseStyles
    }

    const isPinned = column.getIsPinned()
    if (!isPinned) {
        return baseStyles
    }

    // Get all right-pinned columns
    const rightPinnedColumns =
        table
            ?.getAllColumns()
            .filter((col: Column<any, any>) => col.getIsPinned() === 'right') ||
        []

    // Calculate column width based on column type
    const getColumnWidth = (colId: string) => {
        switch (colId) {
            case 'status':
                return 110
            case 'actions':
                return 110
            default:
                return column.getSize()
        }
    }

    // Calculate right position for right-pinned columns
    const calculateRightPosition = () => {
        if (isPinned !== 'right') return undefined

        let position = -1
        const reversedColumns = [...rightPinnedColumns].reverse()
        const columnIndex = reversedColumns.findIndex(
            (col: Column<any, any>) => col.id === column.id,
        )

        // Calculate position based on columns that come after this one
        for (let i = 0; i < columnIndex; i++) {
            position += getColumnWidth(reversedColumns[i].id)
        }

        return position
    }

    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right')

    return {
        ...baseStyles,
        position: 'sticky',
        boxShadow: isLastLeftPinnedColumn
            ? '-1px 0 1px -1px black inset'
            : isFirstRightPinnedColumn
              ? '1px 0 1px -1px black inset'
              : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: calculateRightPosition(),
        backgroundColor: 'white',
        opacity: 1,
        zIndex: 1,
        width: `${getColumnWidth}px`,
        minWidth: `${getColumnWidth}px`,
    }
}

export type DataTableResetHandle = {
    resetSorting: () => void
    resetSelected: () => void
}

function _DataTableScroll<T>(
    props: DataTableScrollProps<T>,
    ref: ForwardedRef<DataTableResetHandle>,
) {
    const {
        skeletonAvatarColumns,
        columns: columnsProp = [],
        data = [],
        loading = false,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        onPaginationChange,
        onSelectChange,
        onSort,
        limits = [20, 40, 60, 80, 100],
        selectable = false,
        skeletonAvatarProps,
        pagingData = {
            total: 0,
            page: 1,
            limit: 10,
        },
        pagination,
        isSelectLimit = true,
        columnPinning: columnPinningProp,
        onColumnPinningChange,
    } = props

    const { limit, page, total } = pagingData

    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
        columnPinningProp || { left: [], right: [] },
    )
    const { larger } = useResponsive()
    const { t } = useTranslation()

    useEffect(() => {
        if (columnPinningProp) {
            setColumnPinning(columnPinningProp)
        }
    }, [columnPinningProp])

    const handleColumnPinningChange = useCallback(
        (
            updaterOrValue:
                | ColumnPinningState
                | ((old: ColumnPinningState) => ColumnPinningState),
        ) => {
            const newColumnPinning =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue(columnPinning)
                    : updaterOrValue
            setColumnPinning(newColumnPinning)
            onColumnPinningChange?.(newColumnPinning)
        },
        [columnPinning, onColumnPinningChange],
    )

    const limitOption = useMemo(
        () =>
            limits.map((number) => ({
                value: number,
                label: `${number} / ${t('dataTable.limitOption.limits.label')}`,
            })),
        [limits, t],
    )

    const handleCheckBoxChange = useCallback(
        (checked: boolean, row: T) => {
            if (!loading) {
                onCheckBoxChange?.(checked, row)
            }
        },
        [loading, onCheckBoxChange],
    )

    const handleIndeterminateCheckBoxChange = useCallback(
        (checked: boolean, rows: Row<T>[]) => {
            if (!loading) {
                onIndeterminateCheckBoxChange?.(checked, rows)
            }
        },
        [loading, onIndeterminateCheckBoxChange],
    )

    const handlePaginationChange = useCallback(
        (page: number) => {
            if (!loading) {
                onPaginationChange?.(page)
            }
        },
        [loading, onPaginationChange],
    )

    const handleSelectChange = useCallback(
        (value?: number) => {
            if (!loading) {
                onSelectChange?.(Number(value))
            }
        },
        [loading, onSelectChange],
    )

    useEffect(() => {
        if (columnPinningProp) {
            if (larger.xl) {
                setColumnPinning(columnPinningProp)
            } else {
                setColumnPinning({ left: [], right: [] })
            }
        }
    }, [larger.xl, columnPinningProp])

    useEffect(() => {
        if (Array.isArray(sorting)) {
            const sortOrder =
                sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            const id = sorting.length > 0 ? sorting[0].id : ''
            onSort?.({ order: sortOrder, key: id })
        }
    }, [sorting, onSort])

    const finalColumns = useMemo(() => {
        const columns = columnsProp

        if (!selectable) return columns

        return [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        onIndeterminateCheckBoxChange={(e) => {
                            handleIndeterminateCheckBoxChange(
                                e.target.checked,
                                table.getRowModel().rows,
                            )
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckbox
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        onCheckBoxChange={(e) =>
                            handleCheckBoxChange(e.target.checked, row.original)
                        }
                    />
                ),
            },
            ...columns,
        ]
    }, [
        columnsProp,
        selectable,
        handleCheckBoxChange,
        handleIndeterminateCheckBoxChange,
    ])

    const tableConfig = useMemo(
        () => ({
            data,
            columns: finalColumns,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            manualPagination: true,
            manualSorting: true,
            onSortingChange: setSorting,
            state: {
                sorting,
                columnPinning,
            },
            onColumnPinningChange: handleColumnPinningChange,
        }),
        [data, finalColumns, sorting, columnPinning, handleColumnPinningChange],
    )

    const table = useReactTable(tableConfig)

    const resetSorting = useCallback(() => {
        table.resetSorting()
    }, [table])

    const resetSelected = useCallback(() => {
        table.toggleAllRowsSelected(false)
    }, [table])

    useImperativeHandle(
        ref,
        () => ({
            resetSorting,
            resetSelected,
        }),
        [resetSorting, resetSelected],
    )

    // Memoize the table rows to prevent unnecessary re-renders
    const tableRows = useMemo(
        () => table.getRowModel().rows.slice(0, limit),
        [table, limit],
    )

    return (
        <Loading loading={loading && data.length !== 0} type="cover">
            <DoubleScrollTable
                compact={props.tableCompact}
                className="min-h-40"
            >
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={getCommonPinningStyles(
                                            header.column,
                                            loading,
                                            table,
                                        )}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center">
                                                <div
                                                    className={classNames(
                                                        header.column.getCanSort() &&
                                                            'cursor-pointer select-none point',
                                                        loading &&
                                                            'pointer-events-none',
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <Sorter
                                                            sort={header.column.getIsSorted()}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                {loading && data.length === 0 ? (
                    <TableRowSkeleton
                        columns={finalColumns.length}
                        rows={pagingData.limit}
                        avatarInColumns={skeletonAvatarColumns}
                        avatarProps={skeletonAvatarProps}
                    />
                ) : data.length === 0 ? (
                    <TBody>
                        <Tr>
                            <Td
                                colSpan={finalColumns.length}
                                className="text-center py-10"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-gray-400">
                                        {t('dataTable.noData')}
                                    </span>
                                </div>
                            </Td>
                        </Tr>
                    </TBody>
                ) : (
                    <TBody>
                        {tableRows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td
                                        key={cell.id}
                                        style={getCommonPinningStyles(
                                            cell.column,
                                            loading,
                                            table,
                                        )}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                )}
            </DoubleScrollTable>
            <div className="flex items-center justify-between mt-4">
                {pagination ? (
                    pagination
                ) : (
                    <>
                        <Pagination
                            pageSize={limit}
                            currentPage={page}
                            total={total}
                            onChange={handlePaginationChange}
                        />
                        <div style={{ minWidth: 130 }}>
                            {isSelectLimit && (
                                <Select
                                    size="sm"
                                    menuPlacement="top"
                                    isSearchable={false}
                                    value={limitOption.filter(
                                        (option) => option.value === limit,
                                    )}
                                    options={limitOption}
                                    onChange={(option) =>
                                        handleSelectChange(option?.value)
                                    }
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </Loading>
    )
}

const DataTableScroll = forwardRef(_DataTableScroll) as <T>(
    props: DataTableScrollProps<T> & {
        ref?: ForwardedRef<DataTableResetHandle>
    },
) => ReturnType<typeof _DataTableScroll>

export type { CellContext, ColumnDef, Row }
export default DataTableScroll
