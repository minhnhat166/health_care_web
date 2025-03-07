import { AdaptableCard, Loading } from '@/components/shared'
import { injectReducer, useAppDispatch } from '@/store'
import useToast from '@/utils/useToast'
import { motion } from 'framer-motion'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DrugDetailBreadcrumb, DrugDetailSection } from './components'
import reducer, { getApiDrugDetail, SLICE_NAME, useAppSelector } from './store'

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

const DrugDetail = () => {
    const loading = useAppSelector((state) => state.drugDetail.items.loading)
    const drugDetail = useAppSelector((state) => state.drugDetail.items.result)

    const { drugId } = useParams<{ drugId: string }>()
    const toast = useToast()
    const dispatch = useAppDispatch()

    const fetchDrugDetail = async () => {
        try {
            if (drugId) await dispatch(getApiDrugDetail(drugId))
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
        if (drugId) fetchDrugDetail()
    }, [drugId])

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
                    <DrugDetailBreadcrumb drug={drugDetail} loading={loading} />
                </motion.div>
                <Loading loading={loading}>
                    {!isEmpty(drugDetail) && (
                        <motion.div
                            className="flex-col items-center justify-center"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                        >
                            <DrugDetailSection drug={drugDetail} />
                        </motion.div>
                    )}
                </Loading>
            </AdaptableCard>
        </motion.div>
    )
}
export default DrugDetail
