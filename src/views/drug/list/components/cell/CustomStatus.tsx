import { Badge, Tooltip } from '@/components/ui'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface StatusCellProps {
    status: string | null
}

const CustomStatusCell = ({ status }: StatusCellProps) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'Created':
                return {
                    color: 'emerald',
                    text: 'Created',
                    icon: <FaCheckCircle color="#52c41a" />,
                    tooltip: 'Status: Created',
                }
            case 'Approved':
                return {
                    color: 'gray',
                    text: 'Approved',
                    icon: <FaCheckCircle color="#8c8c8c" />,
                    tooltip: 'Status: Approved',
                }
            case 'Updated':
                return {
                    color: 'blue',
                    text: 'Updated',
                    icon: <FaCheckCircle color="#1890ff" />,
                    tooltip: 'Status: Updated',
                }
            case 'Inactive':
                return {
                    color: 'red',
                    text: 'Inactive',
                    icon: <FaTimesCircle color="#f5222d" />,
                    tooltip: 'Status: Inactive',
                }
            default:
                return {
                    color: 'gray',
                    text: 'Unknown',
                    icon: <FaTimesCircle color="#d9d9d9" />,
                    tooltip: 'Status: Unknown',
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

export default CustomStatusCell
