import type { Drug } from '@/@types/drug'
import FirebaseFileUpload from '@/components/common/FirebaseFileUpload'
import HTTPFileUpload from '@/components/common/HTTPFileUpload'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

interface CreateDrugModalProps {
    visible: boolean
    onClose: () => void
    onSubmit: (drug: Omit<Drug, 'drugId' | 'createdAt' | 'updatedAt'>) => void
    loading?: boolean
}

// Initial form values
const initialValues = {
    drugId: '',
    tenThuoc: '',
    soDangKy: '',
    dotPheDuyet: '',
    soQuyetDinh: '',
    pheDuyet: '',
    hieuLuc: '',
    nhomThuoc: '',
    hoatChat: '',
    phanLoai: '',
    nongDo: '',
    taDuoc: '',
    baoChe: '',
    dongGoi: '',
    tieuChuan: '',
    tuoiTho: '',
    congTySx: '',
    congTySxCode: '',
    nuocSx: '',
    diaChiSx: '',
    congTyDk: '',
    nuocDk: '',
    diaChiDk: '',
    giaKeKhai: 0,
    huongDanSuDung: '',
    huongDanSuDungBn: '',
    fileName: '',
    isHide: false,
    rate: 0,
    rutSdk: false,
    state: 1,
    images: '',
}

// Form validation schema
const validationSchema = Yup.object({
    drugId: Yup.string()
        .required('This field is required')
        .test('unique-drugId', 'drugId must be unique', async function (value) {
            // Simulate a uniqueness check, replace with actual API call if needed
            const existingDrugIds = ['existingDrugId1', 'existingDrugId2'] // Example existing IDs
            return !existingDrugIds.includes(value || '')
        }),
    tenThuoc: Yup.string().required('This field is required'),
    soDangKy: Yup.string()
        .required('This field is required')
        .test(
            'unique-soDangKy-drugId',
            'soDangKy and drugId must not be the same',
            function (value) {
                return value !== this.parent.drugId
            },
        ),
    soQuyetDinh: Yup.string().required('This field is required'),
    pheDuyet: Yup.string().required('This field is required'),
    nhomThuoc: Yup.string().required('This field is required'),
    hoatChat: Yup.string().required('This field is required'),
    phanLoai: Yup.string().required('This field is required'),
    nongDo: Yup.string().required('This field is required'),
    taDuoc: Yup.string().required('This field is required'),
    baoChe: Yup.string().required('This field is required'),
    dongGoi: Yup.string().required('This field is required'),
    tieuChuan: Yup.string().required('This field is required'),
    tuoiTho: Yup.string().required('This field is required'),
    congTySx: Yup.string().required('This field is required'),
    congTySxCode: Yup.string().required('This field is required'),
    nuocSx: Yup.string().required('This field is required'),
    diaChiSx: Yup.string().required('This field is required'),
    congTyDk: Yup.string().required('This field is required'),
    giaKeKhai: Yup.number().required('This field is required'),
    nuocDk: Yup.string().required('This field is required'),
    diaChiDk: Yup.string().required('This field is required'),
    fileName: Yup.string().required('This field is required'),
})

const CreateDrugModal: React.FC<CreateDrugModalProps> = ({
    visible,
    onClose,
    onSubmit,
    loading = false,
}) => {
    const { t } = useTranslation()
    const modalRef = useRef<HTMLDivElement>(null)
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [uploadType, setUploadType] = useState<'firebase' | 'http'>(
        'firebase',
    )

    const resetForm = () => {
        setImageFiles([])
        setImageUrls([])
    }

    useEffect(() => {
        if (!visible) {
            resetForm()
        }
    }, [visible])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && visible) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [visible, onClose])

    const handleImageUploadComplete = (
        downloadURL: string,
        setFieldValue: any,
    ) => {
        // Add the new URL to the array of image URLs
        const updatedUrls = [...imageUrls, downloadURL].slice(0, 5)
        setImageUrls(updatedUrls)

        // Update form data with the new URLs
        setFieldValue('images', updatedUrls.join(','))
    }

    const removeImage = (indexToRemove: number, setFieldValue: any) => {
        const updatedUrls = imageUrls.filter(
            (_, index) => index !== indexToRemove,
        )
        setImageUrls(updatedUrls)
        setFieldValue('images', updatedUrls.join(','))
    }

    // Close modal when clicking outside
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) {
            onClose()
        }
    }

    if (!visible) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto"
            ref={modalRef}
            onClick={handleClickOutside}
        >
            <div
                className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium">
                        {t(
                            'views.drug.components.dialog.createDrug',
                            'Create New Drug',
                        )}
                    </h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            onSubmit({
                                ...values,
                                searchCount: 0,
                            })
                            setSubmitting(false)
                        }}
                    >
                        {({ values, setFieldValue, errors, touched }) => (
                            <Form>
                                {/* First section - Basic info */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* drugId field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="drugId"
                                        >
                                            {t('views.drug.fields.drugId')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="drugId"
                                            name="drugId"
                                            placeholder={t(
                                                'views.drug.placeholders.drugId',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.drugId && touched.drugId
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="drugId"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                    {/* tenThuoc field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="tenThuoc"
                                        >
                                            {t('views.drug.fields.drugName')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="tenThuoc"
                                            name="tenThuoc"
                                            placeholder={t(
                                                'views.drug.placeholders.drugName',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.tenThuoc &&
                                                touched.tenThuoc
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="tenThuoc"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* soDangKy field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="soDangKy"
                                        >
                                            {t(
                                                'views.drug.fields.registrationNumber',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="soDangKy"
                                            name="soDangKy"
                                            placeholder={t(
                                                'views.drug.placeholders.registrationNumber',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.soDangKy &&
                                                touched.soDangKy
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="soDangKy"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* dotPheDuyet field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="dotPheDuyet"
                                        >
                                            {t(
                                                'views.drug.fields.approvalBatch',
                                            )}
                                        </label>
                                        <Field
                                            type="text"
                                            id="dotPheDuyet"
                                            name="dotPheDuyet"
                                            placeholder={t(
                                                'views.drug.placeholders.approvalBatch',
                                            )}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* soQuyetDinh field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="soQuyetDinh"
                                        >
                                            {t(
                                                'views.drug.fields.decisionNumber',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="soQuyetDinh"
                                            name="soQuyetDinh"
                                            placeholder={t(
                                                'views.drug.placeholders.decisionNumber',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.soQuyetDinh &&
                                                touched.soQuyetDinh
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="soQuyetDinh"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* pheDuyet field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="pheDuyet"
                                        >
                                            {t('views.drug.fields.approval')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field name="pheDuyet">
                                            {({
                                                field,
                                                form,
                                            }: {
                                                field: {
                                                    name: string
                                                    value: string
                                                }
                                                form: {
                                                    setFieldValue: (
                                                        field: string,
                                                        value: any,
                                                    ) => void
                                                }
                                            }) => (
                                                <DatePicker
                                                    inputFormat="YYYY-MM-DD"
                                                    clearable
                                                    placeholder={t(
                                                        'views.drug.placeholders.approval',
                                                    )}
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value,
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            date
                                                                ? date
                                                                      .toISOString()
                                                                      .split(
                                                                          'T',
                                                                      )[0]
                                                                : '',
                                                        )
                                                    }}
                                                    className="w-full"
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage
                                            name="pheDuyet"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* hieuLuc field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="hieuLuc"
                                        >
                                            {t(
                                                'views.drug.fields.effectiveDate',
                                            )}
                                        </label>
                                        <Field name="hieuLuc">
                                            {({
                                                field,
                                                form,
                                            }: {
                                                field: {
                                                    name: string
                                                    value: string
                                                }
                                                form: {
                                                    setFieldValue: (
                                                        field: string,
                                                        value: any,
                                                    ) => void
                                                }
                                            }) => (
                                                <DatePicker
                                                    inputFormat="YYYY-MM-DD"
                                                    clearable
                                                    placeholder={t(
                                                        'views.drug.placeholders.effectiveDate',
                                                    )}
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value,
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            date
                                                                ? date
                                                                      .toISOString()
                                                                      .split(
                                                                          'T',
                                                                      )[0]
                                                                : '',
                                                        )
                                                    }}
                                                    className="w-full"
                                                />
                                            )}
                                        </Field>
                                    </div>

                                    {/* nhomThuoc field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="nhomThuoc"
                                        >
                                            {t('views.drug.fields.drugGroup')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="nhomThuoc"
                                            name="nhomThuoc"
                                            placeholder={t(
                                                'views.drug.placeholders.drugGroup',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.nhomThuoc &&
                                                touched.nhomThuoc
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="nhomThuoc"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* hoatChat field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="hoatChat"
                                        >
                                            {t(
                                                'views.drug.fields.activeIngredient',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="hoatChat"
                                            name="hoatChat"
                                            placeholder={t(
                                                'views.drug.placeholders.activeIngredient',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.hoatChat &&
                                                touched.hoatChat
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="hoatChat"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* phanLoai field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="phanLoai"
                                        >
                                            {t(
                                                'views.drug.fields.classification',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="phanLoai"
                                            name="phanLoai"
                                            placeholder={t(
                                                'views.drug.placeholders.classification',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.phanLoai &&
                                                touched.phanLoai
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="phanLoai"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* nongDo field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="nongDo"
                                        >
                                            {t(
                                                'views.drug.fields.concentration',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="nongDo"
                                            name="nongDo"
                                            placeholder={t(
                                                'views.drug.placeholders.concentration',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.nongDo && touched.nongDo
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="nongDo"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* taDuoc field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="taDuoc"
                                        >
                                            {t('views.drug.fields.excipient')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="taDuoc"
                                            name="taDuoc"
                                            placeholder={t(
                                                'views.drug.placeholders.excipient',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.taDuoc && touched.taDuoc
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="taDuoc"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* baoChe field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="baoChe"
                                        >
                                            {t('views.drug.fields.preparation')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="baoChe"
                                            name="baoChe"
                                            placeholder={t(
                                                'views.drug.placeholders.preparation',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.baoChe && touched.baoChe
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="baoChe"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* dongGoi field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="dongGoi"
                                        >
                                            {t('views.drug.fields.packaging')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="dongGoi"
                                            name="dongGoi"
                                            placeholder={t(
                                                'views.drug.placeholders.packaging',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.dongGoi &&
                                                touched.dongGoi
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="dongGoi"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* tieuChuan field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="tieuChuan"
                                        >
                                            {t('views.drug.fields.standard')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="tieuChuan"
                                            name="tieuChuan"
                                            placeholder={t(
                                                'views.drug.placeholders.standard',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.tieuChuan &&
                                                touched.tieuChuan
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="tieuChuan"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* tuoiTho field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="tuoiTho"
                                        >
                                            {t('views.drug.fields.shelfLife')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="tuoiTho"
                                            name="tuoiTho"
                                            placeholder={t(
                                                'views.drug.placeholders.shelfLife',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.tuoiTho &&
                                                touched.tuoiTho
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="tuoiTho"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <h3 className="mt-6 mb-4 text-lg font-medium text-gray-700">
                                    {t(
                                        'views.drug.sections.manufacturingInformation',
                                    )}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* congTySx field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="congTySx"
                                        >
                                            {t(
                                                'views.drug.fields.manufacturingCompany',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="congTySx"
                                            name="congTySx"
                                            placeholder={t(
                                                'views.drug.placeholders.manufacturingCompany',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.congTySx &&
                                                touched.congTySx
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="congTySx"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* congTySxCode field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="congTySxCode"
                                        >
                                            {t(
                                                'views.drug.fields.manufacturingCompanyCode',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="congTySxCode"
                                            name="congTySxCode"
                                            placeholder={t(
                                                'views.drug.placeholders.manufacturingCompanyCode',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.congTySxCode &&
                                                touched.congTySxCode
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="congTySxCode"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* nuocSx field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="nuocSx"
                                        >
                                            {t(
                                                'views.drug.fields.manufacturingCountry',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="nuocSx"
                                            name="nuocSx"
                                            placeholder={t(
                                                'views.drug.placeholders.manufacturingCountry',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.nuocSx && touched.nuocSx
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="nuocSx"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* diaChiSx field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="diaChiSx"
                                        >
                                            {t(
                                                'views.drug.fields.manufacturingAddress',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="diaChiSx"
                                            name="diaChiSx"
                                            placeholder={t(
                                                'views.drug.placeholders.manufacturingAddress',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.diaChiSx &&
                                                touched.diaChiSx
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="diaChiSx"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                <h3 className="mt-6 mb-4 text-lg font-medium text-gray-700">
                                    {t(
                                        'views.drug.sections.registrationInformation',
                                    )}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* congTyDk field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="congTyDk"
                                        >
                                            {t(
                                                'views.drug.fields.registeringCompany',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="congTyDk"
                                            name="congTyDk"
                                            placeholder={t(
                                                'views.drug.placeholders.registeringCompany',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.congTyDk &&
                                                touched.congTyDk
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="congTyDk"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* nuocDk field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="nuocDk"
                                        >
                                            {t(
                                                'views.drug.fields.registeringCountry',
                                            )}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="nuocDk"
                                            name="nuocDk"
                                            placeholder={t(
                                                'views.drug.placeholders.registeringCountry',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.nuocDk && touched.nuocDk
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="nuocDk"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                {/* diaChiDk field */}
                                <div className="mb-4">
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="diaChiDk"
                                    >
                                        {t(
                                            'views.drug.fields.registeringAddress',
                                        )}{' '}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="diaChiDk"
                                        name="diaChiDk"
                                        placeholder={t(
                                            'views.drug.placeholders.registeringAddress',
                                        )}
                                        className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.diaChiDk && touched.diaChiDk
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="diaChiDk"
                                        component="p"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* giaKeKhai field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="giaKeKhai"
                                        >
                                            {t(
                                                'views.drug.fields.declaredPrice',
                                            )}
                                        </label>
                                        <Field
                                            type="number"
                                            id="giaKeKhai"
                                            name="giaKeKhai"
                                            min="0"
                                            step="0.01"
                                            placeholder={t(
                                                'views.drug.placeholders.declaredPrice',
                                            )}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* rate field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="rate"
                                        >
                                            {t('views.drug.fields.rating')}
                                        </label>
                                        <Field
                                            type="number"
                                            id="rate"
                                            name="rate"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* fileName field */}
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            htmlFor="fileName"
                                        >
                                            {t('views.drug.fields.fileName')}{' '}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <Field
                                            type="text"
                                            id="fileName"
                                            name="fileName"
                                            placeholder={t(
                                                'views.drug.placeholders.fileName',
                                            )}
                                            className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.fileName &&
                                                touched.fileName
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="fileName"
                                            component="p"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                {/* huongDanSuDung field */}
                                <div className="mb-4">
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="huongDanSuDung"
                                    >
                                        {t(
                                            'views.drug.fields.usageInstructions',
                                        )}
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="huongDanSuDung"
                                        name="huongDanSuDung"
                                        rows={3}
                                        placeholder={t(
                                            'views.drug.placeholders.usageInstructions',
                                        )}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* huongDanSuDungBn field */}
                                <div className="mb-4">
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="huongDanSuDungBn"
                                    >
                                        {t(
                                            'views.drug.fields.patientUsageInstructions',
                                        )}
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="huongDanSuDungBn"
                                        name="huongDanSuDungBn"
                                        rows={3}
                                        placeholder={t(
                                            'views.drug.placeholders.patientUsageInstructions',
                                        )}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Images Upload Section */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">
                                        {t('views.drug.fields.images')}
                                    </label>

                                    <div className="mb-3">
                                        <div className="flex space-x-4 mb-3">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="uploadType"
                                                    value="firebase"
                                                    checked={
                                                        uploadType ===
                                                        'firebase'
                                                    }
                                                    onChange={() =>
                                                        setUploadType(
                                                            'firebase',
                                                        )
                                                    }
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2">
                                                    Firebase Storage
                                                </span>
                                            </label>

                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="uploadType"
                                                    value="http"
                                                    checked={
                                                        uploadType === 'http'
                                                    }
                                                    onChange={() =>
                                                        setUploadType('http')
                                                    }
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2">
                                                    HTTP Upload
                                                </span>
                                            </label>
                                        </div>

                                        {uploadType === 'firebase' ? (
                                            <FirebaseFileUpload
                                                storagePath="drugs/image"
                                                onUploadComplete={(url) =>
                                                    handleImageUploadComplete(
                                                        url,
                                                        setFieldValue,
                                                    )
                                                }
                                                acceptedFileTypes="image/*"
                                                maxFileSizeMB={5}
                                                buttonText={t(
                                                    'views.drug.components.buttons.uploadImage',
                                                    'Upload Image',
                                                )}
                                            />
                                        ) : (
                                            <HTTPFileUpload
                                                apiUrl="/api/upload"
                                                onUploadComplete={(url) =>
                                                    handleImageUploadComplete(
                                                        url,
                                                        setFieldValue,
                                                    )
                                                }
                                                acceptedFileTypes="image/*"
                                                maxFileSizeMB={5}
                                                buttonText={t(
                                                    'views.drug.components.buttons.uploadImage',
                                                    'Upload Image',
                                                )}
                                                additionalData={{
                                                    type: 'drug-image',
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Preview uploaded images */}
                                    {imageUrls.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                {t(
                                                    'views.drug.components.form.uploadedImages',
                                                    'Uploaded Images:',
                                                )}
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                {imageUrls.map((url, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={`${t('views.drug.components.form.uploadedImage')} ${index + 1}`}
                                                            className="h-24 w-24 object-cover rounded-md shadow-sm"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index,
                                                                    setFieldValue,
                                                                )
                                                            }
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {imageUrls.length}{' '}
                                                {t(
                                                    'views.drug.components.form.of',
                                                )}{' '}
                                                5{' '}
                                                {t(
                                                    'views.drug.components.form.imagesUploaded',
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {/* Hidden field to store image URLs */}
                                    <Field
                                        type="hidden"
                                        name="images"
                                        value={imageUrls.join(',')}
                                    />
                                </div>

                                {/* Convert checkbox fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* isHide field */}
                                    <div className="mb-4 flex items-center">
                                        <Field
                                            type="checkbox"
                                            id="isHide"
                                            name="isHide"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            className="ml-2 block text-sm text-gray-900"
                                            htmlFor="isHide"
                                        >
                                            {t('views.drug.fields.hidden')}
                                        </label>
                                    </div>

                                    {/* rutSdk field */}
                                    <div className="mb-4 flex items-center">
                                        <Field
                                            type="checkbox"
                                            id="rutSdk"
                                            name="rutSdk"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            className="ml-2 block text-sm text-gray-900"
                                            htmlFor="rutSdk"
                                        >
                                            {t(
                                                'views.drug.fields.registrationWithdrawal',
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                                    >
                                        {t(
                                            'views.drug.components.buttons.cancel',
                                        )}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                            loading
                                                ? 'opacity-70 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        {loading
                                            ? t(
                                                  'views.drug.components.buttons.creating',
                                                  'Creating...',
                                              )
                                            : t(
                                                  'views.drug.components.buttons.create',
                                                  'Create',
                                              )}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default CreateDrugModal
