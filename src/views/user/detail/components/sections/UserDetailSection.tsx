import type { User } from '@/@types/user'
import { Card, Skeleton } from '@/components/ui'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
            duration: 0.5,
            ease: 'backOut',
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 10,
        },
    },
}

const sectionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            staggerChildren: 0.08,
            delayChildren: 0.1,
            ease: 'easeInOut',
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 15,
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
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-950 
                       border border-indigo-100 dark:border-indigo-800 
                       rounded-lg p-3 shadow-sm hover:shadow-md 
                       transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider mb-1">
                {t(`views.user.fields.${fieldKey}`)}
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200 break-words">
                {value || (
                    <span className="text-gray-400 italic">Not specified</span>
                )}
            </div>
        </motion.div>
    )

    const renderSection = (
        title: string,
        fields: { key: string; value: any }[],
    ) => {
        return title ? (
            <motion.div
                className="space-y-4"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <h3
                    className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300 
                               flex items-center gap-2 border-b pb-2 border-indigo-200 dark:border-indigo-800"
                >
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    {title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {fields.map((field) => renderField(field.key, field.value))}
                </div>
            </motion.div>
        ) : (
            <Skeleton className="h-40 bg-gray-100 dark:bg-gray-800" />
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 max-w-full"
        >
            <motion.div variants={cardVariants}>
                <Card
                    className="border-2 border-indigo-100 dark:border-indigo-900 
                               rounded-xl overflow-hidden 
                               shadow-2xl hover:shadow-3xl 
                               transition-shadow duration-500"
                    bodyClass="p-0"
                >
                    <div className="p-6 bg-white dark:bg-gray-900">
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
