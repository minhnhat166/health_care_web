import { Button } from '@/components/ui'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface DetailsButtonProps {
    id: string | number
}

const MotionButton = motion(Button)

const DetailsButton = ({ id }: DetailsButtonProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleViewDetails = () => {
        navigate(`/user/${id}`, {
            state: { id },
        })
    }

    return (
        <MotionButton
            variant="plain"
            className="text-teal-500"
            size="xs"
            icon={<FaEye />}
            onClick={handleViewDetails}
            initial={{ scale: 1 }}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
            }}
        >
            {t('views.user.components.buttons.details')}
        </MotionButton>
    )
}

export default DetailsButton
