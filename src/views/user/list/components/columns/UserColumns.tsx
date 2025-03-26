import type { User } from '@/@types/user'
import ContentCell from '@/components/ui/Cell/ContentCell'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionColumn from './ActionsColumn'

const UserColumns = (page: number, limit: number): ColumnDef<User>[] => {
    const { t } = useTranslation()

    return [
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.user.components.columns.no')}
                </p>
            ),
            id: 'no',
            enablePinning: false,
            cell: (props) => {
                const rowIndex = (page - 1) * limit + props.row.index + 1
                return <span>{rowIndex}</span>
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.user.components.columns.userId')}
                </p>
            ),
            id: 'userId',
            cell: (props) => {
                return <ContentCell content={props.row.original.userId} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.user.components.columns.name')}
                </p>
            ),
            id: 'name',
            cell: (props) => {
                return <ContentCell content={props.row.original.name} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.user.components.columns.email')}
                </p>
            ),
            id: 'email',
            cell: (props) => {
                return <ContentCell content={props.row.original.email} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.user.components.columns.phoneNumber')}
                </p>
            ),
            id: 'phoneNumber',
            cell: (props) => {
                return <ContentCell content={props.row.original.phoneNumber} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.user.components.columns.role')}
                </p>
            ),
            id: 'role',
            cell: (props) => {
                return <ContentCell content={props.row.original.role} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.user.components.columns.actions')}
                </p>
            ),
            id: 'actions',
            enablePinning: true,
            cell: (props) => {
                return (
                    <div className="flex items-start gap-4 flex-auto flex-col py-1">
                        <ActionColumn id={props.row.original.userId} />
                    </div>
                )
            },
        },
    ]
}

export default UserColumns
