import type { Drug } from '@/@types/drug'
import {
    Button,
    Dialog,
    FormContainer,
    FormItem,
    Input,
    Spinner,
} from '@/components/ui'
import { apiGetDrugsId, apiPutDrugsId } from '@/services/DrugService'
import useToast from '@/utils/useToast'
import { Field, Formik, Form as FormikForm } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaEdit } from 'react-icons/fa'
import * as Yup from 'yup'

interface EditButtonProps {
    onClick?: () => void
    disabled?: boolean
    tooltipTitle?: string
    drugId: string
    onSave?: (values: Partial<Drug>) => void
    onSuccess?: () => void
}

const EDITABLE_FIELDS = [
    'tenThuoc',
    'hieuLuc',
    'hoatChat',
    'phanLoai',
    'nongDo',
    'taDuoc',
    'baoChe',
    'dongGoi',
    'tieuChuan',
    'tuoiTho',
    'congTySx',
    'congTySxCode',
    'nuocSx',
    'diaChiSx',
    'congTyDk',
    'nuocDk',
    'diaChiDk',
    'giaKeKhai',
    'huongDanSuDung',
    'huongDanSuDungBn',
    'nhomThuoc',
] as const

type EditableDrugFields = Pick<Drug, (typeof EDITABLE_FIELDS)[number]>

const MotionButton = memo(motion(Button))

const Textarea = ({ field, ...props }: { field: any }) => (
    <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...field}
        {...props}
    />
)

const EditButton = ({
    onClick,
    disabled = false,
    drugId,
    onSave,
    onSuccess,
}: EditButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [drugData, setDrugData] = useState<Drug | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { t } = useTranslation()
    const toast = useToast()

    const handleError = useCallback(
        (messageKey: string) => {
            setError(t(messageKey))
            toast({
                title: t('views.drug.components.toast.error'),
                children: t(messageKey),
                type: 'danger',
            })
        },
        [t, toast],
    )

    const fetchDrugData = useCallback(async () => {
        if (!drugId || !isOpen) return

        setIsLoading(true)
        setError(null)
        try {
            const response = await apiGetDrugsId(drugId)
            if (response?.data) {
                setDrugData(response.data)
            } else {
                throw new Error('No data returned')
            }
        } catch (error) {
            handleError('views.drug.components.toast.errorFetchingDrugData')
        } finally {
            setIsLoading(false)
        }
    }, [drugId, isOpen, handleError])

    useEffect(() => {
        if (isOpen) {
            fetchDrugData()
        }
    }, [isOpen, fetchDrugData])

    const handleOpen = useCallback(() => {
        if (onClick) onClick()
        setIsOpen(true)
    }, [onClick])

    const handleClose = useCallback(() => {
        setIsOpen(false)
        setError(null)
    }, [])

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                tenThuoc: Yup.string().required(
                    t('views.drug.components.form.validation.drugNameRequired'),
                ),
                hieuLuc: Yup.string(),
                hoatChat: Yup.string().required(
                    t(
                        'views.drug.components.form.validation.activeIngredientRequired',
                    ),
                ),
                phanLoai: Yup.string(),
                nongDo: Yup.string(),
                taDuoc: Yup.string(),
                baoChe: Yup.string(),
                dongGoi: Yup.string(),
                tieuChuan: Yup.string(),
                tuoiTho: Yup.string(),
                congTySx: Yup.string().required(
                    t(
                        'views.drug.components.form.validation.manufacturerRequired',
                    ),
                ),
                congTySxCode: Yup.string(),
                nuocSx: Yup.string().required(
                    t(
                        'views.drug.components.form.validation.countryOfManufactureRequired',
                    ),
                ),
                diaChiSx: Yup.string(),
                congTyDk: Yup.string().required(
                    t(
                        'views.drug.components.form.validation.registrationCompanyRequired',
                    ),
                ),
                nuocDk: Yup.string(),
                diaChiDk: Yup.string(),
                giaKeKhai: Yup.string().matches(
                    /^[0-9]+$/,
                    t('views.drug.components.form.validation.priceNumbersOnly'),
                ),
                huongDanSuDung: Yup.string(),
                huongDanSuDungBn: Yup.string(),
                nhomThuoc: Yup.string(),
            }),
        [t],
    )

    const initialValues: EditableDrugFields = useMemo(() => {
        if (!drugData) {
            return EDITABLE_FIELDS.reduce(
                (acc, field) => ({ ...acc, [field]: '' }),
                {} as EditableDrugFields,
            )
        }
        return EDITABLE_FIELDS.reduce(
            (acc, field) => ({
                ...acc,
                [field]: drugData[field] || '',
            }),
            {} as EditableDrugFields,
        )
    }, [drugData])

    const handleSubmit = useCallback(
        async (
            values: EditableDrugFields,
            {
                setSubmitting,
            }: { setSubmitting: (isSubmitting: boolean) => void },
        ) => {
            setIsSaving(true)
            try {
                await apiPutDrugsId(drugId, values as Drug)
                if (onSave) onSave(values)

                toast({
                    title: t('views.drug.components.toast.success'),
                    children: t(
                        'views.drug.components.toast.drugUpdatedSuccess',
                    ),
                    type: 'success',
                })

                if (onSuccess) onSuccess()
                handleClose()
            } catch (error) {
                handleError('views.drug.components.toast.errorUpdatingDrug')
            } finally {
                setSubmitting(false)
                setIsSaving(false)
            }
        },
        [drugId, onSave, onSuccess, t, toast, handleClose, handleError],
    )

    const FormSection = ({ title, children }: any) => (
        <>
            <div className="col-span-2 border-b border-gray-200 pb-2 mb-2 mt-4">
                <h3 className="font-medium text-sm text-gray-600">
                    {t(`views.drug.components.form.sections.${title}`)}
                </h3>
            </div>
            {children}
        </>
    )

    const renderBasicInfoFields = useCallback(
        ({ touched, errors }: any) => (
            <>
                <FormItem
                    className="col-span-2"
                    label={t('views.drug.components.columns.drugName')}
                    invalid={!!(errors.tenThuoc && touched.tenThuoc)}
                    errorMessage={errors.tenThuoc as string}
                >
                    <Field
                        type="text"
                        name="tenThuoc"
                        placeholder={t(
                            'views.drug.components.form.placeholders.enterDrugName',
                        )}
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    className="col-span-1"
                    label={t('views.drug.components.columns.effectiveness')}
                    invalid={!!(errors.hieuLuc && touched.hieuLuc)}
                    errorMessage={errors.hieuLuc as string}
                >
                    <Field type="text" name="hieuLuc" component={Input} />
                </FormItem>

                <FormItem
                    className="col-span-1"
                    label={t('views.drug.components.columns.activeIngredients')}
                    invalid={!!(errors.hoatChat && touched.hoatChat)}
                    errorMessage={errors.hoatChat as string}
                >
                    <Field type="text" name="hoatChat" component={Input} />
                </FormItem>
            </>
        ),
        [t],
    )

    const renderManufacturerFields = useCallback(
        ({ touched, errors }: any) => (
            <>
                <FormItem
                    className="col-span-1"
                    label={t('views.drug.components.columns.manufacturer')}
                    invalid={!!(errors.congTySx && touched.congTySx)}
                    errorMessage={errors.congTySx as string}
                >
                    <Field type="text" name="congTySx" component={Input} />
                </FormItem>

                <FormItem
                    className="col-span-1"
                    label={t('views.drug.components.columns.manufacturerCode')}
                    invalid={!!(errors.congTySxCode && touched.congTySxCode)}
                    errorMessage={errors.congTySxCode as string}
                >
                    <Field type="text" name="congTySxCode" component={Input} />
                </FormItem>

                <FormItem
                    className="col-span-1"
                    label={t(
                        'views.drug.components.columns.countryOfManufacture',
                    )}
                    invalid={!!(errors.nuocSx && touched.nuocSx)}
                    errorMessage={errors.nuocSx as string}
                >
                    <Field type="text" name="nuocSx" component={Input} />
                </FormItem>
            </>
        ),
        [t],
    )

    const renderUsageFields = useCallback(
        ({ touched, errors }: any) => (
            <>
                <FormItem
                    className="col-span-2"
                    label={t('views.drug.components.columns.usageInstructions')}
                    invalid={
                        !!(errors.huongDanSuDung && touched.huongDanSuDung)
                    }
                    errorMessage={errors.huongDanSuDung as string}
                >
                    <Field
                        name="huongDanSuDung"
                        component={Textarea}
                        rows={3}
                    />
                </FormItem>

                <FormItem
                    className="col-span-2"
                    label={t(
                        'views.drug.components.columns.patientUsageInstructions',
                    )}
                    invalid={
                        !!(errors.huongDanSuDungBn && touched.huongDanSuDungBn)
                    }
                    errorMessage={errors.huongDanSuDungBn as string}
                >
                    <Field
                        name="huongDanSuDungBn"
                        component={Textarea}
                        rows={3}
                    />
                </FormItem>
            </>
        ),
        [t],
    )

    const renderButtons = useCallback(
        ({ isSubmitting }: any) => (
            <div className="flex justify-end gap-2 mt-6 col-span-1 md:col-span-2">
                <Button
                    variant="plain"
                    onClick={handleClose}
                    disabled={isSubmitting || isSaving}
                >
                    {t('views.drug.components.buttons.cancel')}
                </Button>
                <Button
                    variant="solid"
                    type="submit"
                    loading={isSubmitting || isSaving}
                >
                    {t('views.drug.components.buttons.save')}
                </Button>
            </div>
        ),
        [t, handleClose, isSaving],
    )

    return (
        <>
            <MotionButton
                variant="plain"
                className="text-orange-500"
                onClick={handleOpen}
                disabled={disabled}
                size="xs"
                icon={<FaEdit />}
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                }}
            >
                {t('views.drug.components.buttons.edit')}
            </MotionButton>

            <AnimatePresence>
                {isOpen && (
                    <Dialog
                        isOpen={isOpen}
                        onClose={handleClose}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center p-8">
                                    <Spinner size={40} />
                                    <p className="mt-2 text-gray-500">
                                        {t(
                                            'views.drug.components.loading.fetchingDrugData',
                                        )}
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="p-6 text-center">
                                    <div className="text-red-500 mb-4">
                                        <h6>{error}</h6>
                                    </div>
                                    <Button
                                        variant="solid"
                                        onClick={fetchDrugData}
                                    >
                                        {t(
                                            'views.drug.components.buttons.retry',
                                        )}
                                    </Button>
                                </div>
                            ) : drugData ? (
                                <Formik
                                    enableReinitialize
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {(formProps) => (
                                        <FormContainer>
                                            <FormikForm className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-1">
                                                <FormSection title="basicInfo">
                                                    {renderBasicInfoFields(
                                                        formProps,
                                                    )}
                                                </FormSection>

                                                <FormSection title="manufacturer">
                                                    {renderManufacturerFields(
                                                        formProps,
                                                    )}
                                                </FormSection>

                                                <FormSection title="usage">
                                                    {renderUsageFields(
                                                        formProps,
                                                    )}
                                                </FormSection>

                                                {renderButtons(formProps)}
                                            </FormikForm>
                                        </FormContainer>
                                    )}
                                </Formik>
                            ) : (
                                <div className="p-4 text-center text-red-500">
                                    <h6>
                                        {t(
                                            'views.drug.components.error.failedToLoadDrugData',
                                        )}
                                    </h6>
                                </div>
                            )}
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    )
}

export default memo(EditButton)
