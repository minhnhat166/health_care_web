import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui'
import {
    uploadFileToStorage,
    UploadProgress,
} from '../../services/FileUploadService'
import { motion } from 'framer-motion'

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
    buttonText = 'Choose File',
}) => {
    const [file, setFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
        null,
    )
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadTaskRef = useRef<{ cancel: () => void } | null>(null)

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
            setError(`File too large. Maximum size is ${maxFileSizeMB}MB.`)
            setFile(null)
            return
        }

        setFile(selectedFile)
    }

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file first')
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
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {buttonText}
                    </Button>
                    {file && (
                        <Button
                            onClick={handleUpload}
                            disabled={
                                !!uploadProgress &&
                                uploadProgress.progress > 0 &&
                                uploadProgress.progress < 100
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Upload
                        </Button>
                    )}
                    {uploadProgress &&
                        uploadProgress.progress > 0 &&
                        uploadProgress.progress < 100 && (
                            <Button
                                onClick={cancelUpload}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </Button>
                        )}
                </div>
            </div>

            {file && (
                <p className="text-sm text-gray-600 mt-2">
                    Selected: {file.name} (
                    {(file.size / 1024 / 1024).toFixed(2)}MB)
                </p>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-2"
                >
                    Error: {error}
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
                            ? `Uploading: ${uploadProgress.progress.toFixed(0)}%`
                            : 'Upload complete!'}
                    </p>
                    {uploadProgress.downloadURL && (
                        <p className="text-sm text-green-600 mt-1">
                            File uploaded successfully!
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default FirebaseFileUpload
