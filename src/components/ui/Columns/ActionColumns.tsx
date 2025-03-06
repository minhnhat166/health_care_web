import { Button } from '@/components/ui'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface ActionColumnProps {
    title: string
    onClick: () => void
    size?: 'xs' | 'sm' | 'md' | 'lg'
    variant?: 'twoTone' | 'solid' | 'plain' | 'default'
    className?: string
    animation?: 'none' | 'scale' | 'pulse' | 'bounce' | 'rotate'
}

const ActionColumn = ({
    title,
    onClick,
    size = 'xs',
    variant = 'twoTone',
    className = '',
    animation = 'scale',
}: ActionColumnProps) => {
    const { textTheme } = useThemeClass()
    const { t } = useTranslation()

    const animationVariants = {
        scale: {
            initial: { scale: 1 },
            hover: { scale: 1.05, transition: { duration: 0.2 } },
            tap: { scale: 0.95, transition: { duration: 0.1 } },
        },
        pulse: {
            initial: { boxShadow: '0 0 0 rgba(0, 0, 0, 0)', brightness: 1 },
            hover: {
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                brightness: 1.05,
                transition: { duration: 0.2 },
            },
            tap: { brightness: 0.95, transition: { duration: 0.1 } },
        },
        bounce: {
            hover: {
                y: [0, -6, 0],
                transition: { repeat: Infinity, duration: 1 },
            },
            tap: { scale: 0.95 },
        },
        rotate: {
            hover: {
                rotate: [0, 5, -5, 0],
                transition: { repeat: Infinity, duration: 1.2 },
            },
            tap: { scale: 0.95 },
        },
        none: {},
    }

    const currentVariant =
        animationVariants[animation] || animationVariants.none

    return (
        <div className={`${className}`}>
            <motion.div
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={currentVariant}
            >
                <Button
                    className={`cursor-pointer min-w-24 ${textTheme} text-xs font-medium flex items-center justify-center`}
                    size={size}
                    variant={variant}
                    onClick={onClick}
                >
                    {t(title)}
                </Button>
            </motion.div>
        </div>
    )
}

export default ActionColumn
