import type { User } from '@/@types/user'
import { Card, Skeleton } from '@/components/ui'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
            duration: 0.4,
            ease: 'easeOut',
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
}

const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            staggerChildren: 0.06,
            delayChildren: 0.05,
            ease: 'easeOut',
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1.0],
        },
    },
}

interface UserDetailSectionProps {
    user: Partial<User>
}

const UserDetailSection = ({ user }: UserDetailSectionProps) => {
    const { t } = useTranslation()

    const basicInfo = [
        { key: 'userId', value: user.userId },
        { key: 'name', value: user.name },
        { key: 'email', value: user.email },
        { key: 'phoneNumber', value: user.phoneNumber },
        { key: 'role', value: user.role },
    ]

    const renderField = (fieldKey: string, value: any) => (
        <motion.div
            key={fieldKey}
            variants={itemVariants}
            className="mb-2 p-0.5 px-3 rounded w-fit hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            whileHover={{ scale: 1.01 }}
        >
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {t(`views.user.fields.${fieldKey}`)}
            </div>
            <div className="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                {value || '-'}
            </div>
        </motion.div>
    )

    const renderSection = (
        title: string,
        fields: { key: string; value: any }[],
    ) => {
        return title ? (
            <motion.div
                className="mb-3 last:mb-0"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400 mb-2 flex items-center">
                    <motion.div
                        className="w-1 h-4 bg-primary-500 rounded-full mr-1.5"
                        initial={{ height: 0 }}
                        animate={{ height: 16 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    ></motion.div>
                    {title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-1.5">
                    {fields.map((field) => renderField(field.key, field.value))}
                </div>
                <motion.div
                    className="w-full h-px bg-gray-200 dark:bg-gray-700 mt-3"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                ></motion.div>
            </motion.div>
        ) : (
            <Skeleton className="h-32" />
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-full"
        >
            <motion.div variants={cardVariants}>
                <Card
                    className="border dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
                    bodyClass="p-1"
                >
                    <div className="relative p-2 bg-white dark:bg-gray-900/80">
                        {renderSection(
                            t('views.user.components.form.sections.basicInfo'),
                            basicInfo,
                        )}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export default UserDetailSection
