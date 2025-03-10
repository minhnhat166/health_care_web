import { storage } from '../firebase/firebase.config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export interface UploadProgress {
    progress: number
    downloadURL: string | null
    error: Error | null
}

/**
 * Upload a file to Firebase Storage
 * @param file File to upload
 * @param path Storage path (e.g., 'images/profile')
 * @param onProgress Callback for upload progress updates
 */
export const uploadFileToStorage = (
    file: File,
    path: string,
    onProgress: (progress: UploadProgress) => void,
): { cancel: () => void } => {
    // Create a unique file name
    const fileName = `${new Date().getTime()}_${file.name}`
    const storageRef = ref(storage, `${path}/${fileName}`)

    // Create upload task
    const uploadTask = uploadBytesResumable(storageRef, file)

    // Monitor upload progress
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            onProgress({ progress, downloadURL: null, error: null })
        },
        (error) => {
            onProgress({ progress: 0, downloadURL: null, error })
        },
        async () => {
            // Upload complete
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            onProgress({ progress: 100, downloadURL, error: null })
        },
    )

    // Return cancel function
    return {
        cancel: () => uploadTask.cancel(),
    }
}

/**
 * Upload a file to API endpoint using HTTP POST
 * @param file File to upload
 * @param apiUrl API endpoint URL
 * @param onProgress Callback for upload progress updates
 * @param additionalData Additional form data to include
 */
export const uploadFileToAPI = async (
    file: File,
    apiUrl: string,
    onProgress: (progress: UploadProgress) => void,
    additionalData?: Record<string, string>,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)

        // Add additional data if provided
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value)
            })
        }

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100
                onProgress({ progress, downloadURL: null, error: null })
            }
        })

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText)
                    onProgress({
                        progress: 100,
                        downloadURL: response.fileUrl,
                        error: null,
                    })
                    resolve(response.fileUrl)
                } catch (error) {
                    onProgress({
                        progress: 0,
                        downloadURL: null,
                        error: new Error('Invalid server response'),
                    })
                    reject(new Error('Invalid server response'))
                }
            } else {
                onProgress({
                    progress: 0,
                    downloadURL: null,
                    error: new Error(`HTTP Error: ${xhr.status}`),
                })
                reject(new Error(`HTTP Error: ${xhr.status}`))
            }
        })

        xhr.addEventListener('error', () => {
            onProgress({
                progress: 0,
                downloadURL: null,
                error: new Error('Network error occurred'),
            })
            reject(new Error('Network error occurred'))
        })

        xhr.open('POST', apiUrl, true)
        xhr.send(formData)
    })
}
