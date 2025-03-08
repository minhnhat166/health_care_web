import { Button } from '@/components/ui'
import { useAppDispatch } from '@/store'
import { CiRedo } from 'react-icons/ci'
import { getUserList, useAppSelector } from '../../store'
import { useCallback } from 'react'

const UserListTableRefreshButton = () => {
    const dispatch = useAppDispatch()

    const { page, pageSize } = useAppSelector(
        (state) => state.userList.items.metadata,
    )
    const loading = useAppSelector((state) => state.userList.items.loading)

    const fetchData = useCallback(() => {
        dispatch(
            getUserList({
                page: page || 1,
                pageSize: pageSize || 10,
            }),
        )
    }, [dispatch, page, pageSize])

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

export default UserListTableRefreshButton
