import { Button, Drawer } from '@/components/ui'
import useResponsive from '@/utils/hooks/useResponsive'
import { useLayoutEffect, useRef, useState, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlineFilter } from 'react-icons/hi'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import DrugTableFilterForm from '../form/DrugTableFilterForm'
import DrugTableSearchForm from '../form/DrugTableSearchForm'

// Custom hook for element height measurement
const useElementHeight = () => {
    const ref = useRef<HTMLDivElement>(null)
    const [minHeight, setMinHeight] = useState<number>(0)

    useLayoutEffect(() => {
        if (!ref.current) return

        const measureHeight = () => {
            if (ref.current) {
                const height = ref.current.getBoundingClientRect().height
                setMinHeight((prev) => Math.max(height, prev))
            }
        }

        // Measure after initial render
        measureHeight()

        // Setup ResizeObserver to track content size changes
        const resizeObserver = new ResizeObserver(measureHeight)
        resizeObserver.observe(ref.current)

        return () => resizeObserver.disconnect()
    }, [])

    return { ref, minHeight }
}

// Memoized FilterDrawer component
const FilterDrawer = memo(
    ({
        isOpen,
        onClose,
        title,
    }: {
        title: string
        isOpen: boolean
        onClose: () => void
    }) => (
        <Drawer
            title={title}
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            onRequestClose={onClose}
        >
            <DrugTableSearchForm onFilterComplete={onClose} />
            <DrugTableFilterForm onFilterComplete={onClose} />
        </Drawer>
    ),
)

FilterDrawer.displayName = 'FilterDrawer'

// Section header with collapse/expand functionality
const SectionHeader = memo(
    ({
        title,
        isExpanded,
        onToggle,
        accentColor = 'bg-primary-500',
        ariaLabelExpand,
        ariaLabelCollapse,
    }: {
        title: string
        isExpanded: boolean
        onToggle: () => void
        accentColor?: string
        ariaLabelExpand: string
        ariaLabelCollapse: string
    }) => (
        <div
            className="flex items-center justify-between mb-4 select-none cursor-pointer"
            onClick={onToggle}
        >
            <div className="flex items-center">
                <div className={`w-1.5 h-5 ${accentColor} rounded mr-2`}></div>
                <h3 className="text-base font-semibold">{title}</h3>
            </div>
            <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={isExpanded ? ariaLabelCollapse : ariaLabelExpand}
            >
                {isExpanded ? (
                    <MdExpandLess size={20} />
                ) : (
                    <MdExpandMore size={20} />
                )}
            </button>
        </div>
    ),
)

SectionHeader.displayName = 'SectionHeader'

const DrugTableTools = () => {
    const { t } = useTranslation()
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const { larger } = useResponsive()
    const { ref: containerRef, minHeight } = useElementHeight()

    // States for section collapse/expand
    const [isSearchExpanded, setIsSearchExpanded] = useState(true)
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(true)

    const openFilterDrawer = useCallback(() => setIsFilterOpen(true), [])
    const closeFilterDrawer = useCallback(() => setIsFilterOpen(false), [])
    const toggleSearch = useCallback(
        () => setIsSearchExpanded((prev) => !prev),
        [],
    )
    const toggleFilters = useCallback(
        () => setIsFiltersExpanded((prev) => !prev),
        [],
    )

    return (
        <div
            ref={containerRef}
            style={{ minHeight: larger.xl ? minHeight : undefined }}
            className="transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
            {/* If screen smaller than 1280 */}
            {!larger.xl && (
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex items-center justify-between">
                    <h3 className="text-base font-medium flex items-center">
                        <span className="w-1 h-6 bg-primary-500 rounded mr-2"></span>
                        {t(
                            'views.drug.filter.filterDrawer.searchTools',
                            'Drug Search Tools',
                        )}
                    </h3>
                    <Button
                        variant="twoTone"
                        className="px-4 py-1.5"
                        icon={<HiOutlineFilter className="text-lg" />}
                        onClick={openFilterDrawer}
                    >
                        {t('views.drug.filter.filterDrawer.filterButton')}
                    </Button>
                </div>
            )}

            {/* If screen bigger than 1280 */}
            {larger.xl ? (
                <div className="p-4">
                    <div className="mb-6">
                        <SectionHeader
                            title={t(
                                'views.drug.filter.search.title',
                                'Quick Search',
                            )}
                            isExpanded={isSearchExpanded}
                            onToggle={toggleSearch}
                            accentColor="bg-indigo-500"
                            ariaLabelExpand={t(
                                'views.drug.filter.search.collapsible.expand',
                                'Expand search section',
                            )}
                            ariaLabelCollapse={t(
                                'views.drug.filter.search.collapsible.collapse',
                                'Collapse search section',
                            )}
                        />
                        <div
                            className={`bg-gray-50 dark:bg-gray-800/30 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                                isSearchExpanded
                                    ? 'max-h-[1000px] opacity-100 p-4'
                                    : 'max-h-0 opacity-0 p-0'
                            }`}
                        >
                            {isSearchExpanded && <DrugTableSearchForm />}
                        </div>
                    </div>
                    <div>
                        <SectionHeader
                            title={t(
                                'views.drug.filter.filters.title',
                                'Advanced Filters',
                            )}
                            isExpanded={isFiltersExpanded}
                            onToggle={toggleFilters}
                            accentColor="bg-indigo-500"
                            ariaLabelExpand={t(
                                'views.drug.filter.filters.collapsible.expand',
                                'Expand filters section',
                            )}
                            ariaLabelCollapse={t(
                                'views.drug.filter.filters.collapsible.collapse',
                                'Collapse filters section',
                            )}
                        />
                        <div
                            className={`bg-gray-50 dark:bg-gray-800/30 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                                isFiltersExpanded
                                    ? 'max-h-[1000px] opacity-100 p-4'
                                    : 'max-h-0 opacity-0 p-0'
                            }`}
                        >
                            {isFiltersExpanded && <DrugTableFilterForm />}
                        </div>
                    </div>
                </div>
            ) : (
                <FilterDrawer
                    title={t('views.drug.filter.filterDrawer.title')}
                    isOpen={isFilterOpen}
                    onClose={closeFilterDrawer}
                />
            )}
        </div>
    )
}

export default DrugTableTools
