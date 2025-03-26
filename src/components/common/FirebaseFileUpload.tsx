import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui'
import {
    uploadFileToStorage,
    UploadProgress,
} from '../../services/FileUploadService'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface FirebaseFileUploadProps {
    storagePath: string
    onUploadComplete?: (downloadURL: string) => void
    acceptedFileTypes?: string
    maxFileSizeMB?: number
    buttonText?: string
}

const FirebaseFileUpload: React.FC<FirebaseFileUploadProps> = ({
    storagePath,
    onUploadComplete,
    acceptedFileTypes = 'image/*,.pdf',
    maxFileSizeMB = 5,
    buttonText,
}) => {
    const { t } = useTranslation()
    const [file, setFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
        null,
    )
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadTaskRef = useRef<{ cancel: () => void } | null>(null)

    const defaultButtonText = t(
        'components.common.fileUpload.chooseFile',
        'Choose File',
    )

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null

        // Reset states
        setError(null)
        setUploadProgress(null)

        if (!selectedFile) {
            setFile(null)
            return
        }

        // Validate file size
        if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
            setError(
                `${t('components.common.fileUpload.fileTooLarge')} ${maxFileSizeMB}${t('components.common.fileUpload.fileSize')}.`,
            )
            setFile(null)
            return
        }

        setFile(selectedFile)
    }

    const handleUpload = () => {
        if (!file) {
            setError(
                t(
                    'components.common.fileUpload.selectFileFirst',
                    'Please select a file first',
                ),
            )
            return
        }

        // Reset error before upload
        setError(null)

        // Begin upload and store reference to allow cancellation
        uploadTaskRef.current = uploadFileToStorage(
            file,
            storagePath,
            (progress) => {
                setUploadProgress(progress)

                if (progress.error) {
                    setError(progress.error.message)
                } else if (progress.downloadURL && progress.progress === 100) {
                    onUploadComplete?.(progress.downloadURL)
                }
            },
        )
    }

    const cancelUpload = () => {
        if (uploadTaskRef.current) {
            uploadTaskRef.current.cancel()
            setUploadProgress(null)
            uploadTaskRef.current = null
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="mb-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={acceptedFileTypes}
                    className="hidden"
                />
                <div className="flex space-x-2">
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded"
                    >
                        {buttonText || defaultButtonText}
                    </Button>
                    {file && (
                        <Button
                            onClick={handleUpload}
                            disabled={
                                !!uploadProgress &&
                                uploadProgress.progress > 0 &&
                                uploadProgress.progress < 100
                            }
                            className="px-4 py-2 rounded"
                        >
                            {t('components.common.fileUpload.upload', 'Upload')}
                        </Button>
                    )}
                    {uploadProgress &&
                        uploadProgress.progress > 0 &&
                        uploadProgress.progress < 100 && (
                            <Button
                                onClick={cancelUpload}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                {t(
                                    'components.common.fileUpload.cancel',
                                    'Cancel',
                                )}
                            </Button>
                        )}
                </div>
            </div>

            {file && (
                <p className="text-sm text-gray-600 mt-2">
                    {t('components.common.fileUpload.selected')} {file.name} (
                    {(file.size / 1024 / 1024).toFixed(2)}
                    {t('components.common.fileUpload.fileSize')})
                </p>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-2"
                >
                    {t('components.common.fileUpload.error')} {error}
                </motion.div>
            )}

            {uploadProgress && uploadProgress.progress > 0 && (
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                            className="bg-blue-600 h-2.5 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${uploadProgress.progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {uploadProgress.progress < 100
                            ? `${t('components.common.fileUpload.uploading')} ${uploadProgress.progress.toFixed(0)}%`
                            : t('components.common.fileUpload.uploadComplete')}
                    </p>
                    {uploadProgress.downloadURL && (
                        <p className="text-sm text-green-600 mt-1">
                            {t('components.common.fileUpload.fileUploaded')}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default FirebaseFileUpload
