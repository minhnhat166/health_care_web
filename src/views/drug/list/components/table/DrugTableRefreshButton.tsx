import { Button } from '@/components/ui'
import { useAppDispatch } from '@/store'
import { CiRedo } from 'react-icons/ci'
import { getApiDrugs, useAppSelector } from '../../store'
import { useCallback } from 'react'

const DrugTableRefreshButton = () => {
    const dispatch = useAppDispatch()

    const { page, pageSize } = useAppSelector(
        (state) => state.drug.items.metadata,
    )
    const loading = useAppSelector((state) => state.drug.items.loading)
    const userId = useAppSelector((state) => state.auth.user.userId)

    const fetchData = useCallback(() => {
        if (userId) {
            dispatch(
                getApiDrugs({
                    page: page || 1,
                    pageSize: pageSize || 10,
                }),
            )
        }
    }, [dispatch, page, pageSize, userId])

    return (
        <Button
            shape="circle"
            size="xs"
            variant="solid"
            icon={<CiRedo />}
            disabled={loading}
            onClick={fetchData}
        />
    )
}

export default DrugTableRefreshButton
