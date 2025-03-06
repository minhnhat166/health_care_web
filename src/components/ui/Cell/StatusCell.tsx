import { Badge, Tooltip } from '@/components/ui'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface StatusCellProps {
    status: boolean | null
}

const StatusCell = ({ status }: StatusCellProps) => {
    const getStatusConfig = () => {
        if (status) {
            return {
                color: 'success',
                text: 'Active',
                icon: <FaCheckCircle color="#52c41a" />,
                tooltip: 'Currently active',
            }
        } else {
            return {
                color: 'error',
                text: 'Inactive',
                icon: <FaTimesCircle color="#f5222d" />,
                tooltip: 'Currently inactive',
            }
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <Tooltip title={statusConfig.tooltip}>
            <Badge
                innerClass={`bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
                content={statusConfig.text}
            />
        </Tooltip>
    )
}

export default StatusCell
