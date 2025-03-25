import type { Drug } from '@/@types/drug'
import { Card, Skeleton } from '@/components/ui'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import 'react-quill/dist/quill.snow.css'
import FileViewerSection from './FileViewSections'

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

// Rich Text Viewer component
const RichTextViewer = ({ content }: { content: string }) => {
    // This function checks if the content is HTML or plain text
    const isHTML = useMemo(() => {
        return /<\/?[a-z][\s\S]*>/i.test(content)
    }, [content])

    return (
        <div className="rich-text-viewer">
            {isHTML ? (
                <div
                    className="ql-viewer"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            ) : (
                <p className="text-xs text-gray-700 dark:text-gray-300">
                    {content}
                </p>
            )}
        </div>
    )
}

interface DrugDetailSectionProps {
    drug: Partial<Drug>
}

// Section title component for consistent styling
const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400 mb-2 flex items-center">
        <motion.div
            className="w-1 h-4 bg-primary-500 rounded-full mr-1.5"
            initial={{ height: 0 }}
            animate={{ height: 16 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        ></motion.div>
        {title}
    </h3>
)

// Usage instructions section
const UsageSection = ({ content }: { content: string }) => (
    <motion.div variants={itemVariants} className="mb-3 last:mb-0">
        <SectionTitle
            title={useTranslation().t('views.drug.form.sections.usage')}
        />
        <div className="prose-sm max-w-none dark:prose-invert p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800">
            <RichTextViewer content={content} />
        </div>
        <motion.div
            className="w-full h-px bg-gray-200 dark:bg-gray-700 mt-3"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        ></motion.div>
    </motion.div>
)

// Images section component
const ImagesSection = ({ images }: { images: string }) => (
    <motion.div variants={itemVariants} className="mb-3 last:mb-0">
        <SectionTitle
            title={useTranslation().t(
                'views.drug.components.form.sections.images',
            )}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <img
                src={images}
                alt={`Drug Image`}
                className="w-full h-auto rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-300"
                onClick={() => window.open(images, '_blank')}
            />
        </div>
        <motion.div
            className="w-full h-px bg-gray-200 dark:bg-gray-700 mt-3"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        ></motion.div>
    </motion.div>
)

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

    const renderSection = (
        title: string,
        fields: { key: string; value: any }[],
    ) => {
        return title ? (
            <motion.div
                className="mb-3 last:mb-0"
                variants={itemVariants}
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
            className="max-w-full space-y-8"
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
                </div>
            </Card>
            {drug.huongDanSuDung && (
                <UsageSection content={drug.huongDanSuDung} />
            )}
            {drug.images && <ImagesSection images={drug.images} />}
            {drug.fileName && <FileViewerSection fileName={drug.fileName} />}
        </motion.div>
    )
}

export default DrugDetailSection
