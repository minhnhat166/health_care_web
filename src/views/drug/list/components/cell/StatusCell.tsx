import { Badge, Tooltip } from '@/components/ui'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface StatusCellProps {
    status: boolean | null
}

const StatusCell = ({ status }: StatusCellProps) => {
    const getStatusConfig = () => {
        if (status) {
            return {
                color: 'emerald',
                text: 'Hidden',
                icon: <FaCheckCircle color="#52c41a" />,
                tooltip: 'Currently is hidden',
            }
        } else {
            return {
                color: 'red',
                text: 'Active',
                icon: <FaTimesCircle color="#f5222d" />,
                tooltip: 'Currently is active',
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

export default StatusCell
