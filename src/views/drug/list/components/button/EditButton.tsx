import type { Drug } from '@/@types/drug'
import { Button, Dialog, FormContainer, Spinner } from '@/components/ui'
import useToast from '@/utils/useToast'
import { Formik, Form as FormikForm } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FaEdit } from 'react-icons/fa'
import {
    BasicInfoSection,
    FormulationSection,
    ManufacturerSection,
    RegistrationCompanySection,
    UsageSection,
    StatusSection,
} from '../form/form-sections'
import { useDrugForm } from '../hooks/useDrugForm'

interface EditButtonProps {
    disabled?: boolean
    tooltipTitle?: string
    drugId: string
    onSave?: (values: Partial<Drug>) => void
    onSuccess?: () => void
    className?: string
}

const MotionButton = memo(motion(Button))

const EditButton = ({
    disabled = false,
    drugId,
    onSave,
    onSuccess,
    className = '',
}: EditButtonProps) => {
    const { t } = useTranslation()
    const toast = useToast()

    const {
        isOpen,
        isLoading,
        isSaving,
        error,
        drugData,
        validationSchema,
        initialValues,
        handleOpen,
        handleClose,
        handleSubmit,
        fetchDrugData,
    } = useDrugForm({ drugId, onSave, onSuccess, t })

    const renderButtons = useCallback(
        ({ isSubmitting }: any) => (
            <div className="flex flex-auto justify-end gap-2 mt-6 col-span-2">
                <Button
                    variant="plain"
                    onClick={handleClose}
                    disabled={isSubmitting || isSaving}
                >
                    {t('views.drug.components.buttons.cancel')}
                </Button>
                <Button
                    variant="solid"
                    type="submit"
                    loading={isSubmitting || isSaving}
                >
                    {t('views.drug.components.buttons.save')}
                </Button>
            </div>
        ),
        [t, handleClose, isSaving],
    )

    const handleButtonClick = useCallback(async () => {
        try {
            handleOpen()
        } catch (error) {
            toast({
                title: t('views.drug.components.toast.error'),
                children: t(
                    'views.drug.components.toast.errorFetchingDrugData',
                ),
                type: 'danger',
            })
        }
    }, [handleOpen])

    return (
        <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant="plain"
                    size="xs"
                    icon={<FaEdit />}
                    onClick={handleOpen}
                    className={`text-blue-500 ${className}`}
                    disabled={disabled}
                >
                    {t('views.drug.components.buttons.edit', 'Edit')}
                </Button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <Dialog
                        isOpen={isOpen}
                        onClose={handleClose}
                        className="overflow-hidden"
                        contentClassName="overflow-hidden"
                        width={800}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center p-8">
                                    <Spinner size={40} />
                                    <p className="mt-2 text-gray-500">
                                        {t(
                                            'views.drug.components.loading.fetchingDrugData',
                                        )}
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="p-6 text-center">
                                    <div className="text-red-500 mb-4">
                                        <h6>{t(error)}</h6>
                                    </div>
                                    <Button
                                        variant="solid"
                                        onClick={fetchDrugData}
                                    >
                                        {t(
                                            'views.drug.components.buttons.retry',
                                        )}
                                    </Button>
                                </div>
                            ) : drugData ? (
                                <Formik
                                    enableReinitialize
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {(formProps) => (
                                        <FormContainer>
                                            <FormikForm className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-1">
                                                <BasicInfoSection
                                                    {...formProps}
                                                />
                                                <FormulationSection
                                                    {...formProps}
                                                />
                                                <ManufacturerSection
                                                    {...formProps}
                                                />
                                                <RegistrationCompanySection
                                                    {...formProps}
                                                />
                                                <UsageSection {...formProps} />
                                                <StatusSection {...formProps} />
                                                {renderButtons(formProps)}
                                            </FormikForm>
                                        </FormContainer>
                                    )}
                                </Formik>
                            ) : (
                                <div className="p-4 text-center text-red-500">
                                    <h6>
                                        {t(
                                            'views.drug.components.error.failedToLoadDrugData',
                                        )}
                                    </h6>
                                </div>
                            )}
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    )
}

export default memo(EditButton)
