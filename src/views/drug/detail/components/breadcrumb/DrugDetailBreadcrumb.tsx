import type { Drug } from '@/@types/drug'
import Breadcrumb, {
    BreadcrumbItem,
} from '@/components/common/Breadcrumb/Breadcrumb'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

type DrugDetailBreadcrumbProps = {
    loading: boolean
    drug: Drug | null
}

const DrugDetailBreadcrumb = ({ loading, drug }: DrugDetailBreadcrumbProps) => {
    const { t } = useTranslation()

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: t('nav.home'),
            path: '/',
            icon: '',
        },
        {
            label: t('views.drug.title'),
            path: '/drug',
            icon: '',
        },
        {
            label:
                drug?.tenThuoc ||
                t('views.drug.components.loading.fetchingDrugData'),
            path: '',
        },
    ]

    return (
        <motion.div
            layout
            transition={{
                layout: { duration: 0.3, ease: 'easeOut' },
            }}
            className="relative"
        >
            {loading && (
                <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <motion.div
                        className="h-4 w-4 rounded-full bg-blue-500"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.div>
            )}
            <Breadcrumb items={breadcrumbItems} className="rounded-md" />
        </motion.div>
    )
}

export default DrugDetailBreadcrumb
