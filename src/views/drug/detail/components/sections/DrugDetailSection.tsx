import type { Drug } from '@/@types/drug'
import { Card } from '@/components/ui'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Simplified animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
    },
}

interface DrugDetailSectionProps {
    drug: Partial<Drug>
}

const DrugDetailSection = ({ drug }: DrugDetailSectionProps) => {
    const { t } = useTranslation()

    const basicInfo = [
        { key: 'drugId', value: drug.drugId },
        { key: 'drugName', value: drug.tenThuoc },
        { key: 'classification', value: drug.phanLoai },
        { key: 'drugGroup', value: drug.nhomThuoc },
    ]

    const approvalInfo = [
        { key: 'approvalBatch', value: drug.dotPheDuyet },
        { key: 'decisionNumber', value: drug.soQuyetDinh },
        { key: 'approvalDate', value: drug.pheDuyet },
        { key: 'registrationNumber', value: drug.soDangKy },
    ]

    const formulationInfo = [
        { key: 'activeIngredients', value: drug.hoatChat },
        { key: 'concentration', value: drug.nongDo },
        { key: 'excipients', value: drug.taDuoc },
        { key: 'dosageForm', value: drug.baoChe },
        { key: 'packaging', value: drug.dongGoi },
    ]

    const manufacturerInfo = [
        { key: 'manufacturer', value: drug.congTySx },
        { key: 'manufacturerCode', value: drug.congTySxCode },
        { key: 'countryOfManufacture', value: drug.nuocDk },
        { key: 'manufacturingAddress', value: drug.nuocSx },
    ]

    // More compact field rendering
    const renderField = (fieldKey: string, value: any) => (
        <motion.div
            key={fieldKey}
            variants={itemVariants}
            className="mb-2 p-0.5 px-3 rounded w-fit"
        >
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {t(`views.drug.fields.${fieldKey}`)}
            </div>
            <div className="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                {value || '-'}
            </div>
        </motion.div>
    )

    // More compact section rendering
    const renderSection = (
        title: string,
        fields: { key: string; value: any }[],
    ) => (
        <motion.div
            className="mb-3 last:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400 mb-2 flex items-center">
                <div className="w-1 h-4 bg-primary-500 rounded-full mr-1.5"></div>
                {title}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-1.5">
                {fields.map((field) => renderField(field.key, field.value))}
            </div>
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mt-3"></div>
        </motion.div>
    )

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-full"
        >
            <Card
                className="border dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
                bodyClass="p-1"
            >
                <div className="relative p-2 bg-white dark:bg-gray-900/80">
                    {renderSection(
                        t('views.drug.components.form.sections.basicInfo'),
                        basicInfo,
                    )}
                    {renderSection(
                        t('views.drug.components.form.sections.approval'),
                        approvalInfo,
                    )}
                    {renderSection(
                        t('views.drug.components.form.sections.formulation'),
                        formulationInfo,
                    )}
                    {renderSection(
                        t('views.drug.components.form.sections.manufacturer'),
                        manufacturerInfo,
                    )}

                    {drug.huongDanSuDung && (
                        <motion.div variants={itemVariants} className="mb-2">
                            <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400 mb-2 flex items-center">
                                <div className="w-1 h-4 bg-primary-500 rounded-full mr-1.5"></div>
                                {t('views.drug.form.sections.usage')}
                            </h3>
                            <div className="prose-sm max-w-none dark:prose-invert p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800">
                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                    {drug.huongDanSuDung}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}

export default DrugDetailSection
