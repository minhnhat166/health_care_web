import type { Drug } from '@/@types/drug'
import { Button, toast } from '@/components/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreateDrugModal from '../modal/CreateDrugModal'
import { apiPostDrugs } from '@/services/DrugService'
import useToast from '@/utils/useToast'

interface CreateButtonProps {
    onCreateDrug?: (
        drug: Omit<Drug, 'drugId' | 'createdAt' | 'updatedAt'>,
    ) => Promise<void>
    loading?: boolean
    disabled?: boolean
    tooltip?: string
}

const CreateButton = ({
    onCreateDrug,
    loading = false,
    disabled = false,
    tooltip,
}: CreateButtonProps) => {
    const { t } = useTranslation()
    const [showTooltip, setShowTooltip] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toast = useToast()

    const buttonTooltip = tooltip || t('views.drug.components.buttons.create')

    const handleOpenModal = () => {
        setIsModalVisible(true)
    }

    const handleCloseModal = () => {
        setIsModalVisible(false)
    }

    const handleCreateDrug = async (
        drug: Omit<Drug, 'drugId' | 'createdAt' | 'updatedAt'>,
    ) => {
        try {
            setIsSubmitting(true)

            if (onCreateDrug) {
                await onCreateDrug(drug)
            } else {
                console.log('Creating drug:', drug)
                // Simulate API delay
                const response = await apiPostDrugs(drug)
                console.log('Drug created:', response.data)
                toast({
                    title: t(
                        'views.drug.components.toast.drugCreated',
                        'Drug created!',
                    ),
                    children: t(
                        'views.drug.components.toast.drugCreatedSuccess',
                        'Drug created successfully!',
                    ),
                })
            }

            // Close modal after successful creation
            setIsModalVisible(false)
        } catch (error) {
            console.error('Failed to create drug:', error)
            alert(
                t(
                    'views.drug.components.toast.errorCreatingDrug',
                    'Failed to create drug. Please try again.',
                ),
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const button = (
        <Button
            onClick={handleOpenModal}
            disabled={disabled || loading || isSubmitting}
            variant="twoTone"
            className={`
        flex items-center gap-2 px-4 py-2 mb-4
        font-medium rounded-md shadow
        transition-colors duration-200 ease-in-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading || isSubmitting ? 'opacity-70' : ''}
      `}
            onMouseEnter={() => buttonTooltip && setShowTooltip(true)}
            onMouseLeave={() => buttonTooltip && setShowTooltip(false)}
        >
            <span className="flex items-center justify-center">
                {loading || isSubmitting ? (
                    <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : (
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                )}
            </span>
            {t('views.drug.components.buttons.create', 'Create')}
        </Button>
    )

    return (
        <div className="relative inline-block">
            {button}
            {buttonTooltip && showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-10 mb-1">
                    {buttonTooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 border-4 border-transparent border-t-gray-800"></div>
                </div>
            )}

            <CreateDrugModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onSubmit={handleCreateDrug}
                loading={isSubmitting}
            />
        </div>
    )
}

export default CreateButton
