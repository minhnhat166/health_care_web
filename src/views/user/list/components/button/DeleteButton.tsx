import { Button, Tooltip } from '@/components/ui'
import { Dialog } from '@/components/ui/Dialog'
import { apiDeleteUsersId } from '@/services/UserService'
import useToast from '@/utils/useToast'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaTrash } from 'react-icons/fa'

interface DeleteButtonProps {
    id: string
    onSuccess?: () => void
    onError?: (error: any) => void
}

const DeleteButton = ({ id, onSuccess, onError }: DeleteButtonProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const { t } = useTranslation()
    const toast = useToast()

    const handleOpenConfirm = () => {
        setIsConfirmOpen(true)
    }

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false)
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            if (id) await apiDeleteUsersId(id)
            setIsDeleting(false)
            handleCloseConfirm()
            toast({
                title: t('views.user.components.toast.success', 'Success'),
                children: t(
                    'views.user.components.toast.userDeleted',
                    'User deleted successfully.',
                ),
                type: 'success',
            })
        } catch (error) {
            setIsDeleting(false)
            if (onError) {
                onError(error)
            }
            toast({
                title: t('views.user.components.toast.error', 'Error'),
                children: t(
                    'views.user.components.toast.errorDeletingUser',
                    'An error occurred while deleting the drug.',
                ),
                type: 'danger',
            })
        }
    }

    // Animation variants
    const dialogVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 },
        },
    }

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    }

    return (
        <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant="plain"
                    size="xs"
                    icon={<FaTrash />}
                    onClick={handleOpenConfirm}
                    className="text-red-500"
                >
                    {t('views.user.components.buttons.delete', 'Delete')}
                </Button>
            </motion.div>

            <Dialog
                isOpen={isConfirmOpen}
                onClose={handleCloseConfirm}
                className="flex flex-auto justify-center transform translate-y-full md:translate-y-1/2"
                contentClassName="flex flex-col gap-5"
            >
                <motion.div
                    variants={dialogVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <h5 className="px-4">
                        {t(
                            'views.user.components.dialog.confirmDeletion',
                            'Confirm Deletion',
                        )}
                    </h5>
                    <p className="p-4">
                        {t(
                            'views.user.components.dialog.deleteConfirmation',
                            'Are you sure you want to delete this user? This action cannot be undone.',
                        )}
                    </p>

                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button
                            variant="default"
                            onClick={handleCloseConfirm}
                            disabled={isDeleting}
                        >
                            {t(
                                'views.user.components.buttons.cancel',
                                'Cancel',
                            )}
                        </Button>
                    </motion.div>
                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button
                            variant="solid"
                            onClick={handleDelete}
                            loading={isDeleting}
                        >
                            {t(
                                'views.user.components.buttons.delete',
                                'Delete',
                            )}
                        </Button>
                    </motion.div>
                </motion.div>
            </Dialog>
        </>
    )
}

export default DeleteButton
