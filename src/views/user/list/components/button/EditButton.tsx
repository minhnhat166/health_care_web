import type { User } from '@/@types/user'
import { Button, Dialog, FormContainer, Spinner } from '@/components/ui'
import useToast from '@/utils/useToast'
import { Formik, Form as FormikForm } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FaEdit } from 'react-icons/fa'
import {
    BasicInfoSection
} from '../form/form-sections'
import { useUserForm } from '../hooks/useUserForm'

interface EditButtonProps {
    disabled?: boolean
    tooltipTitle?: string
    id: string
    onSave?: (values: Partial<User>) => void
    onSuccess?: () => void
}

const MotionButton = memo(motion(Button))

const EditButton = ({
    disabled = false,
    id,
    onSave,
    onSuccess,
}: EditButtonProps) => {
    const { t } = useTranslation()
    const toast = useToast()

    const {
        isOpen,
        isLoading,
        isSaving,
        error,
        userData,
        validationSchema,
        initialValues,
        handleOpen,
        handleClose,
        handleSubmit,
        fetchData,
    } = useUserForm({ id, onSave, onSuccess, t })

    const renderButtons = useCallback(
        ({ isSubmitting }: any) => (
            <div className="flex justify-end gap-2 mt-6 col-span-1 md:col-span-2">
                <Button
                    variant="plain"
                    onClick={handleClose}
                    disabled={isSubmitting || isSaving}
                >
                    {t('views.user.components.buttons.cancel')}
                </Button>
                <Button
                    variant="solid"
                    type="submit"
                    loading={isSubmitting || isSaving}
                >
                    {t('views.user.components.buttons.save')}
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
                title: t('views.user.components.toast.error'),
                children: t(
                    'views.user.components.toast.errorFetchingUserData',
                ),
                type: 'danger',
            })
        }
    }, [handleOpen])

    return (
        <>
            <MotionButton
                variant="plain"
                className="text-orange-500"
                onClick={handleButtonClick}
                disabled={disabled}
                size="xs"
                icon={<FaEdit />}
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                }}
            >
                {t('views.user.components.buttons.edit')}
            </MotionButton>

            <AnimatePresence>
                {isOpen && (
                    <Dialog
                        isOpen={isOpen}
                        onClose={handleClose}
                        className="overflow-hidden"
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
                                            'views.user.components.loading.fetchingUserData',
                                        )}
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="p-6 text-center">
                                    <div className="text-red-500 mb-4">
                                        <h6>{t(error)}</h6>
                                    </div>
                                    <Button variant="solid" onClick={fetchData}>
                                        {t(
                                            'views.user.components.buttons.retry',
                                        )}
                                    </Button>
                                </div>
                            ) : userData ? (
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
                                                {renderButtons(formProps)}
                                            </FormikForm>
                                        </FormContainer>
                                    )}
                                </Formik>
                            ) : (
                                <div className="p-4 text-center text-red-500">
                                    <h6>
                                        {t(
                                            'views.user.components.error.failedToLoadUserData',
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
