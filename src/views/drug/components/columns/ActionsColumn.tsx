import { Button } from '@/components/ui'
import { memo } from 'react'
import DeleteButton from '../button/DeleteButton'
import EditButton from '../button/EditButton'
import DetailsButton from '../button/DetailsButton'

interface ActionColumnProps {
    drugId: string
    className?: string
    showDelete?: boolean
    showEdit?: boolean
    showDetails?: boolean
}

const ActionColumn = memo(
    ({
        drugId,
        className = '',
        showDelete = true,
        showEdit = true,
        showDetails = true,
    }: ActionColumnProps) => {
        const handleEdit = () => {
            console.log('Edits')
        }
        return (
            <div
                className={`flex items-center gap-2 flex-auto flex-col ${className}`}
            >
                {showDelete && <DeleteButton drugId={drugId} />}
                {showEdit && (
                    <EditButton onClick={handleEdit} drugId={drugId} />
                )}
                {showDetails && <DetailsButton drugId={drugId} />}
            </div>
        )
    },
)

ActionColumn.displayName = 'ActionColumn'

export default ActionColumn
