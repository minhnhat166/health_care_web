import { motion } from 'framer-motion'
import { File, FileText, Image, Loader2 } from 'lucide-react'
import { lazy, Suspense, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-quill/dist/quill.snow.css'

// Set up PDF.js worker
// Note: You'll need to host these worker files on your server or use a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// Lazy load Quill
const ReactQuill = lazy(() => import('react-quill'))

const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
    },
}

// PDF Viewer Component
const PDFViewer = ({ url }: { url: string }) => {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        setLoading(false)
    }

    function onDocumentLoadError() {
        setError(true)
        setLoading(false)
    }

    return (
        <div className="pdf-viewer w-full flex flex-col items-center">
            {loading && (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700" />
                </div>
            )}

            {error && (
                <div className="text-red-500 py-4">
                    Failed to load PDF.{' '}
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        Open in new tab
                    </a>
                </div>
            )}

            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="max-w-full"
            >
                <Page
                    pageNumber={pageNumber}
                    width={450}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            </Document>

            {numPages && (
                <div className="flex items-center justify-between w-full px-4 py-2">
                    <button
                        onClick={() =>
                            setPageNumber(Math.max(1, pageNumber - 1))
                        }
                        disabled={pageNumber <= 1}
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>

                    <p className="text-sm text-gray-600">
                        Page {pageNumber} of {numPages}
                    </p>

                    <button
                        onClick={() =>
                            setPageNumber(Math.min(numPages, pageNumber + 1))
                        }
                        disabled={pageNumber >= numPages}
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

const FileViewerSection = ({
    fileName,
    fileContent = '',
}: {
    fileName: string
    fileContent?: string
}) => {
    const { t } = useTranslation()
    const [quillContent, setQuillContent] = useState(fileContent)

    // Extract real filename and extension from the URL
    const { displayName, extension } = useMemo(() => {
        // Handle Firebase Storage URLs
        if (fileName.includes('firebasestorage.googleapis.com')) {
            // Extract the real filename from the URL path
            const urlObj = new URL(fileName)
            const pathSegments = decodeURIComponent(urlObj.pathname).split('/')

            // Find the last segment with a file extension
            let fileNameFromPath = ''
            for (let i = pathSegments.length - 1; i >= 0; i--) {
                if (pathSegments[i].includes('.')) {
                    fileNameFromPath = pathSegments[i]
                    break
                }
            }

            // Extract any encoded filename in the URL
            const matches = fileName.match(/(%2F|\/)([\w\d\s._-]+\.\w+)(\?|$)/i)
            const extractedName = matches ? matches[2] : fileNameFromPath

            // Get extension
            const parts = extractedName.split('.')
            const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''

            return {
                displayName: extractedName,
                extension: ext,
            }
        } else {
            // Handle regular filenames
            const parts = fileName.split('.')
            const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
            return {
                displayName: fileName.split('/').pop() || fileName,
                extension: ext,
            }
        }
    }, [fileName])

    // Determine if the file is an image or PDF
    const isImage = useMemo(() => {
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(
            extension || '',
        )
    }, [extension])

    const isPDF = useMemo(() => {
        return extension === 'pdf'
    }, [extension])

    // Determine file type for display purposes
    const fileType = useMemo(() => {
        if (isImage) return 'IMAGE'
        if (isPDF) return 'PDF'
        return (extension || 'file').toUpperCase()
    }, [extension, isImage, isPDF])

    // Icon selection based on file type
    const FileIcon = isImage ? Image : fileType === 'PDF' ? FileText : File

    // Quill modules configuration
    const modules = {
        toolbar: false, // Disable toolbar for read-only view
        clipboard: {
            matchVisual: false,
        },
    }

    return (
        <motion.div variants={itemVariants} className="mb-3 last:mb-0 ">
            <div className="border border-gray-300 rounded-lg overflow-hidden max-w-full shadow-sm">
                {/* Header */}
                <div className="bg-white p-2 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center">
                        <FileIcon className="w-5 h-5 mr-2 text-violet-500" />
                        <span className="text-sm font-semibold text-violet-500 truncate w-full">
                            {displayName}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">{fileType}</div>
                </div>

                {/* Content Area */}
                <div className="p-2 bg-gray-50 flex justify-center items-center w-full overflow-hidden">
                    {isImage ? (
                        <img
                            src={fileName}
                            alt={fileName}
                            className="max-w-full h-auto max-h-96 object-cover"
                            onClick={() => {
                                return window.open(fileName, '_blank')
                            }}
                        />
                    ) : isPDF ? (
                        <div className="w-full max-h-[400px] overflow-auto">
                            <PDFViewer url={fileName} />
                        </div>
                    ) : (
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                                </div>
                            }
                        >
                            <ReactQuill
                                value={quillContent}
                                readOnly={true}
                                modules={modules}
                                theme="snow"
                                className="w-full max-h-[400px] overflow-auto"
                                placeholder={t(
                                    'views.drug.components.fileViewer.loading',
                                )}
                            />
                        </Suspense>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white p-2 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-xs text-gray-600 truncate">
                        {displayName}
                    </div>
                    <div className="text-xs text-violet-500 font-semibold">
                        {fileType}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default FileViewerSection
