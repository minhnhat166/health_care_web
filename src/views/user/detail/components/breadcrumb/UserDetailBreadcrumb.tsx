import type { User } from '@/@types/user'
import Breadcrumb, {
    BreadcrumbItem,
} from '@/components/common/Breadcrumb/Breadcrumb'
import { motion } from 'framer-motion'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

type DrugDetailBreadcrumbProps = {
    user: User | null
}

const UserDetailBreadcrumb = ({ user }: DrugDetailBreadcrumbProps) => {
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
        <motion.div
            layout
            transition={{
                layout: { duration: 0.3, ease: 'easeOut' },
            }}
            className="relative"
        >
            <Breadcrumb items={breadcrumbItems} className="rounded-md" />
        </motion.div>
    )
}

export default memo(UserDetailBreadcrumb)
