import { Button, Drawer } from '@/components/ui'
import useResponsive from '@/utils/hooks/useResponsive'
import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlineFilter } from 'react-icons/hi'
import QRBoxTableFilterForm from '../form/QRBoxTableFilterForm'

interface FilterDrawerProps {
    title: string
    isOpen: boolean
    onClose: () => void
}

const FilterDrawer = ({ isOpen, onClose, title }: FilterDrawerProps) => {
    return (
        <Drawer
            title={title}
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            onRequestClose={onClose}
        >
            <QRBoxTableFilterForm onFilterComplete={onClose} />
        </Drawer>
    )
}

const DrugTableTools = () => {
    const { t } = useTranslation()
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const { larger } = useResponsive()
    const containerRef = useRef<HTMLDivElement>(null)
    const [minHeight, setMinHeight] = useState<number>(0)

    // Use useLayoutEffect to measure and set minimum height before browser paint
    useLayoutEffect(() => {
        if (larger.xl && containerRef.current) {
            const measureHeight = () => {
                if (containerRef.current) {
                    const height =
                        containerRef.current.getBoundingClientRect().height
                    setMinHeight(Math.max(height, minHeight))
                }
            }

            // Measure after initial render
            measureHeight()

            // Setup ResizeObserver to track content size changes
            const resizeObserver = new ResizeObserver(measureHeight)
            resizeObserver.observe(containerRef.current)

            return () => {
                resizeObserver.disconnect()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [larger.xl])

    const openFilterDrawer = () => setIsFilterOpen(true)
    const closeFilterDrawer = () => setIsFilterOpen(false)

    return (
        <div
            ref={containerRef}
            style={{ minHeight: larger.xl ? minHeight : undefined }}
            className="transition-all duration-200 ease-in-out"
        >
            {/* If screen smaller than 1280 */}
            {!larger.xl && (
                <Button
                    size="xs"
                    shape="circle"
                    className="ltr:mr-2 rtl:ml-2"
                    icon={<HiOutlineFilter />}
                    onClick={openFilterDrawer}
                >
                    {t(
                        'transactions.transactionList.transactionTableTools.filterDrawer.filterButton',
                    )}
                </Button>
            )}
            {/* If screen bigger than 1280 */}
            {larger.xl ? (
                <QRBoxTableFilterForm />
            ) : (
                <FilterDrawer
                    title={t(
                        'transactions.transactionList.transactionTableTools.filterDrawer.title',
                    )}
                    isOpen={isFilterOpen}
                    onClose={closeFilterDrawer}
                />
            )}
        </div>
    )
}

export default DrugTableTools
