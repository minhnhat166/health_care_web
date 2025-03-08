import { memo } from 'react'
import DeleteButton from '../button/DeleteButton'
import DetailsButton from '../button/DetailsButton'
import EditButton from '../button/EditButton'

interface ActionColumnProps {
    id: string
    className?: string
    showDelete?: boolean
    showEdit?: boolean
    showDetails?: boolean
}

const ActionColumn = memo(
    ({
        id,
        className = '',
        showDelete = true,
        showEdit = true,
        showDetails = true,
    }: ActionColumnProps) => {
        return (
            <div
                className={`flex items-start gap-2 flex-auto flex-col ${className}`}
            >
                {showDelete && <DeleteButton id={id} />}
                {showEdit && <EditButton id={id} />}
                {showDetails && <DetailsButton id={id} />}
            </div>
        )
    },
)

ActionColumn.displayName = 'ActionColumn'

export default ActionColumn
