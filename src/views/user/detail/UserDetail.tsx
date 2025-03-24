import { AdaptableCard, Loading } from '@/components/shared'
import { injectReducer, useAppDispatch } from '@/store'
import useToast from '@/utils/useToast'
import { motion } from 'framer-motion'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { UserDetailBreadcrumb, UserDetailSection } from './components'
import reducer, { getApiUserDetail, SLICE_NAME, useAppSelector } from './store'

injectReducer(SLICE_NAME, reducer)

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.7,
            when: 'beforeChildren',
            staggerChildren: 0.3,
            ease: 'easeInOut',
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
            type: 'spring',
            stiffness: 100,
        },
    },
}

const breadcrumbVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
}

const UserDetail = () => {
    const loading = useAppSelector((state) => state.userDetail.items.loading)
    const userDetail = useAppSelector((state) => state.userDetail.items.result)

    const { id } = useParams<{ id: string }>()
    const toast = useToast()
    const dispatch = useAppDispatch()

    const fetchDetail = async () => {
        try {
            if (id) await dispatch(getApiUserDetail(id))
        } catch (error) {
            toast({
                title: 'Error',
                children:
                    error instanceof Error
                        ? error.message
                        : 'An unknown error occurred',
                type: 'danger',
            })
        }
    }

    useEffect(() => {
        if (id) fetchDetail()
    }, [id])

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <AdaptableCard className="h-full" bodyClass="h-full">
                <motion.div
                    className="flex-col items-center justify-center mb-8"
                    variants={breadcrumbVariants}
                >
                    <UserDetailBreadcrumb user={userDetail} />
                </motion.div>
                <Loading loading={loading}>
                    {!isEmpty(userDetail) && (
                        <motion.div
                            className="flex-col items-center justify-center"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                        >
                            <UserDetailSection user={userDetail} />
                        </motion.div>
                    )}
                </Loading>
            </AdaptableCard>
        </motion.div>
    )
}
export default UserDetail
