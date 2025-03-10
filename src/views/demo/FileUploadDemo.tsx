import React, { useState } from 'react'
import FirebaseFileUpload from '@/components/common/FirebaseFileUpload'
import HTTPFileUpload from '@/components/common/HTTPFileUpload'

const FileUploadDemo = () => {
    const [firebaseFileUrl, setFirebaseFileUrl] = useState<string | null>(null)
    const [apiFileUrl, setApiFileUrl] = useState<string | null>(null)

    const handleFirebaseUploadComplete = (downloadURL: string) => {
        setFirebaseFileUrl(downloadURL)
        console.log('File uploaded to Firebase Storage:', downloadURL)
    }

    const handleApiUploadComplete = (downloadURL: string) => {
        setApiFileUrl(downloadURL)
        console.log('File uploaded to API:', downloadURL)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-8">File Upload Demo</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Firebase Storage Upload */}
                <div className="p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        Firebase Storage Upload
                    </h2>
                    <FirebaseFileUpload
                        storagePath="uploads"
                        onUploadComplete={handleFirebaseUploadComplete}
                        maxFileSizeMB={10}
                        buttonText="Select File for Firebase"
                    />

                    {firebaseFileUrl && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">
                                Uploaded File:
                            </h3>
                            {firebaseFileUrl.match(
                                /\.(jpg|jpeg|png|gif|webp)$/i,
                            ) ? (
                                <img
                                    src={firebaseFileUrl}
                                    alt="Uploaded file"
                                    className="max-w-full h-auto max-h-64 rounded-lg border"
                                />
                            ) : (
                                <a
                                    href={firebaseFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View uploaded file
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* HTTP API Upload */}
                <div className="p-6 border rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        HTTP API Upload
                    </h2>
                    <HTTPFileUpload
                        apiUrl="https://your-api-endpoint.com/upload"
                        onUploadComplete={handleApiUploadComplete}
                        maxFileSizeMB={10}
                        buttonText="Select File for API"
                        additionalData={{
                            userId: '123',
                            documentType: 'profile',
                        }}
                    />

                    {apiFileUrl && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">
                                Uploaded File:
                            </h3>
                            {apiFileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img
                                    src={apiFileUrl}
                                    alt="Uploaded file"
                                    className="max-w-full h-auto max-h-64 rounded-lg border"
                                />
                            ) : (
                                <a
                                    href={apiFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View uploaded file
                                </a>
                            )}
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                        <p className="font-medium text-yellow-700">Note:</p>
                        <p className="text-yellow-600">
                            For HTTP upload to work, ensure your API endpoint
                            accepts multipart/form-data and handles file uploads
                            properly. Update the apiUrl prop with your actual
                            endpoint.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileUploadDemo
