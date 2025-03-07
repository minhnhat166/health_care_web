import type { Drug } from '@/@types/drug'
import ContentCell from '@/components/ui/Cell/ContentCell'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import ActionColumn from './ActionsColumn'

const DrugColumns = (page: number, limit: number): ColumnDef<Drug>[] => {
    const { t } = useTranslation()

    return [
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.drug.components.columns.no')}
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
                    {t('views.drug.components.columns.drugId')}
                </p>
            ),
            id: 'drugId',
            cell: (props) => {
                return <ContentCell content={props.row.original.drugId} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.drug.components.columns.drugName')}
                </p>
            ),
            id: 'tenThuoc',
            cell: (props) => {
                return <ContentCell content={props.row.original.tenThuoc} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.drug.components.columns.approvalBatch')}
                </p>
            ),
            id: 'dotPheDuyet',
            cell: (props) => {
                return <ContentCell content={props.row.original.dotPheDuyet} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.drug.components.columns.decisionNumber')}
                </p>
            ),
            id: 'soQuyetDinh',
            cell: (props) => {
                return <ContentCell content={props.row.original.soQuyetDinh} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.drug.components.columns.approvalDate')}
                </p>
            ),
            id: 'pheDuyet',
            cell: (props) => {
                return <ContentCell content={props.row.original.pheDuyet} />
            },
        },
        {
            header: () => (
                <p className="text-pretty">
                    {t('views.drug.components.columns.actions')}
                </p>
            ),
            id: 'actions',
            enablePinning: true,
            cell: (props) => {
                return <ActionColumn drugId={props.row.original.drugId} />
            },
        },
    ]
}

export default DrugColumns
