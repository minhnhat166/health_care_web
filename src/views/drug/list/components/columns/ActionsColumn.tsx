import { memo } from 'react'
import DeleteButton from '../button/DeleteButton'
import DetailsButton from '../button/DetailsButton'
import EditButton from '../button/EditButton'

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
        return (
            <div
                className={`flex items-start gap-4 flex-auto flex-col py-1 ${className}`}
            >
                {showDelete && <DeleteButton drugId={drugId} />}
                {showEdit && <EditButton drugId={drugId} />}
                {showDetails && <DetailsButton drugId={drugId} />}
            </div>
        )
    },
)

ActionColumn.displayName = 'ActionColumn'

export default ActionColumn
