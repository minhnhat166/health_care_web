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
            className="bg-white dark:bg-gray-800 
                       border border-gray-100 dark:border-gray-700
                       rounded-lg overflow-hidden shadow-sm
                       transition-all duration-300 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700
                       group"
        >
            <div className="flex items-stretch">
                <div className="bg-indigo-500 dark:bg-indigo-600 w-2 group-hover:w-3 transition-all duration-300"></div>
                <div className="flex-1 p-4">
                    <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 font-medium">
                        {t(`views.user.fields.${fieldKey}`)}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                        {value || (
                            <span className="text-gray-400 dark:text-gray-500 font-normal">
                                Not available
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )

    const renderSection = (
        title: string,
        fields: { key: string; value: any }[],
    ) => {
        return title ? (
            <motion.div
                className="space-y-5"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                        {title}
                        <div className="mt-1 h-1 w-12 bg-indigo-500 rounded-full"></div>
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => renderField(field.key, field.value))}
                </div>
            </motion.div>
        ) : (
            <Skeleton className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 max-w-full"
        >
            <motion.div variants={cardVariants}>
                <Card
                    className="border border-gray-200 dark:border-gray-700 
                               rounded-xl overflow-hidden 
                               shadow-md
                               bg-white dark:bg-gray-900"
                    bodyClass="p-0"
                >
                    <div className="p-6">
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
