import { Badge, Tooltip } from '@/components/ui'
import {
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
} from 'react-icons/fa'

interface StateCellProps {
    state: number | null
}

const StateCell = ({ state }: StateCellProps) => {
    const getStatusConfig = () => {
        if (state === 202) {
            return {
                color: 'emerald',
                text: 'Active',
                icon: <FaCheckCircle className="text-green-500" />,
                tooltip: 'Currently active',
            }
        } else if (state === 404) {
            return {
                color: 'amber',
                text: 'Not Found',
                icon: <FaExclamationTriangle className="text-amber-500" />,
                tooltip: 'Resource not found',
            }
        } else if (state === 500) {
            return {
                color: 'red',
                text: 'Error',
                icon: <FaTimesCircle className="text-red-500" />,
                tooltip: 'Server error occurred',
            }
        } else {
            return {
                color: 'red',
                text: 'Inactive',
                icon: <FaTimesCircle className="text-red-500" />,
                tooltip: 'Currently inactive',
            }
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <Tooltip title={statusConfig.tooltip}>
            <Badge
                innerClass={`bg-${statusConfig.color}-100 text-${statusConfig.color}-600`}
                content={statusConfig.text}
            />
        </Tooltip>
    )
}

export default StateCell
