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
                text: 'Active',
                icon: <FaCheckCircle color="#52c41a" />,
                tooltip: 'Currently is active',
            }
        } else {
            return {
                color: 'red',
                text: 'Hidden',
                icon: <FaTimesCircle color="#f5222d" />,
                tooltip: 'Currently is hidden',
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
