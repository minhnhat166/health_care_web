import type { Drug } from '@/@types/drug'
import { Card, Skeleton } from '@/components/ui'
import { motion } from 'framer-motion'
import { memo, useMemo, type ReactNode } from 'react'
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

// Field component for individual data items
const Field = memo(
    ({
        fieldKey,
        value,
        customRender,
    }: {
        fieldKey: string
        value: any
        customRender?: (val: any) => ReactNode
    }) => {
        const { t } = useTranslation()

        return (
            <motion.div
                key={fieldKey}
                variants={itemVariants}
                className="mb-2 p-0.5 px-3 rounded w-fit"
            >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t(`views.drug.fields.${fieldKey}`)}
                </div>
                <div className="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-100 break-words truncate w-32 md:w-40 lg:w-48">
                    {customRender ? customRender(value) : value || '-'}
                </div>
            </motion.div>
        )
    },
)

// Section component for grouping fields
const Section = memo(
    ({
        title,
        fields,
    }: {
        title: string
        fields: {
            key: string
            value: any
            render?: (val: any) => ReactNode
        }[]
    }) => {
        if (!title) return <Skeleton className="h-32" />

        return (
            <motion.div
                className="mb-3 last:mb-0"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <SectionTitle title={title} />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-1.5">
                    {fields.map((field) => (
                        <Field
                            key={field.key}
                            fieldKey={field.key}
                            value={field.value}
                            customRender={field.render}
                        />
                    ))}
                </div>
                <motion.div
                    className="w-full h-px bg-gray-200 dark:bg-gray-700 mt-3"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                ></motion.div>
            </motion.div>
        )
    },
)

const DrugDetailSection = ({ drug }: DrugDetailSectionProps) => {
    const { t } = useTranslation()

    const basicInfo = useMemo(
        () => [
            { key: 'drugId', value: drug.drugId },
            { key: 'drugName', value: drug.tenThuoc },
            { key: 'classification', value: drug.phanLoai },
            { key: 'drugGroup', value: drug.nhomThuoc },
        ],
        [drug.drugId, drug.tenThuoc, drug.phanLoai, drug.nhomThuoc],
    )

    const approvalInfo = useMemo(
        () => [
            { key: 'approvalBatch', value: drug.dotPheDuyet },
            { key: 'decisionNumber', value: drug.soQuyetDinh },
            { key: 'approvalDate', value: drug.pheDuyet },
            { key: 'registrationNumber', value: drug.soDangKy },
        ],
        [drug.dotPheDuyet, drug.soQuyetDinh, drug.pheDuyet, drug.soDangKy],
    )

    const formulationInfo = useMemo(
        () => [
            { key: 'activeIngredients', value: drug.hoatChat },
            { key: 'concentration', value: drug.nongDo },
            { key: 'excipients', value: drug.taDuoc },
            { key: 'dosageForm', value: drug.baoChe },
            { key: 'packaging', value: drug.dongGoi },
        ],
        [drug.hoatChat, drug.nongDo, drug.taDuoc, drug.baoChe, drug.dongGoi],
    )

    const manufacturerInfo = useMemo(
        () => [
            { key: 'manufacturer', value: drug.congTySx },
            { key: 'manufacturerCode', value: drug.congTySxCode },
            { key: 'countryOfManufacture', value: drug.nuocDk },
            { key: 'manufacturingAddress', value: drug.nuocSx },
        ],
        [drug.congTySx, drug.congTySxCode, drug.nuocDk, drug.nuocSx],
    )

    // Helper function to get status color
    const getStatusColor = (status: string | undefined) => {
        if (!status) {
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }

        if (typeof status === 'string') {
            if (
                status === 'Created' ||
                status === 'Approved' ||
                status === 'Updated'
            ) {
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            } else if (status === 'Inactive') {
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }
        }

        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }

    const statusInfo = useMemo(
        () => [
            {
                key: 'state',
                value: drug.state,
                render: (value: any) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}
                    >
                        {value || '-'}
                    </span>
                ),
            },
            {
                key: 'isHidden',
                value: drug.isHide ? 'Hidden' : 'Active',
                render: (value: any) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${drug.isHide ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                key: 'status',
                value: drug.status,
                render: (value: any) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}
                    >
                        {value || '-'}
                    </span>
                ),
            },
            {
                key: 'createdAt',
                value: drug.createdAt
                    ? new Date(drug.createdAt).toLocaleDateString()
                    : '-',
            },
            {
                key: 'updatedAt',
                value: drug.updatedAt
                    ? new Date(drug.updatedAt).toLocaleDateString()
                    : '-',
            },
        ],
        [drug.state, drug.isHide, drug.status, drug.createdAt, drug.updatedAt],
    )

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
                    <Section
                        title={t(
                            'views.drug.components.form.sections.basicInfo',
                        )}
                        fields={basicInfo}
                    />
                    <Section
                        title={t(
                            'views.drug.components.form.sections.approval',
                        )}
                        fields={approvalInfo}
                    />
                    <Section
                        title={t(
                            'views.drug.components.form.sections.formulation',
                        )}
                        fields={formulationInfo}
                    />
                    <Section
                        title={t(
                            'views.drug.components.form.sections.manufacturer',
                        )}
                        fields={manufacturerInfo}
                    />
                    <Section
                        title={t('views.drug.components.form.sections.status')}
                        fields={statusInfo}
                    />
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
