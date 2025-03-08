import type { User } from '@/@types/user'
import Breadcrumb, {
    BreadcrumbItem,
} from '@/components/common/Breadcrumb/Breadcrumb'
import { Loading } from '@/components/shared'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

type DrugDetailBreadcrumbProps = {
    loading: boolean
    user: User | null
}

const UserDetailBreadcrumb = ({ loading, user }: DrugDetailBreadcrumbProps) => {
    const { t } = useTranslation()

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: t('nav.home'),
            path: '/',
            icon: '',
        },
        {
            label: t('views.user.title'),
            path: '/user',
            icon: '',
        },
        {
            label:
                user?.name ||
                t('views.user.components.loading.fetchingUserData'),
            path: '',
        },
    ]

    return (
        <Loading loading={loading}>
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
        </Loading>
    )
}

export default UserDetailBreadcrumb
