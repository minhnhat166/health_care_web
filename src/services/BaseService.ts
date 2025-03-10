import { Notification, toast } from '@/components/ui'
import appConfig from '@/configs/app.config'
import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import i18n from '@/locales'
import deepParseJson from '@/utils/deepParseJson'
import axios from 'axios'
import { createElement } from 'react'
import store, { persistor, signOutSuccess } from '../store'

const unauthorizedCode = [401, 403]

const BaseService = axios.create({
    baseURL: appConfig.apiPrefix,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
})

const handleSignOut = async () => {
    try {
        store.dispatch(signOutSuccess())
        await persistor.flush()
        toast.push(
            createElement(
                Notification,
                {
                    title: 'Error',
                    type: 'warning',
                    duration: 3000,
                    closable: true,
                },
                i18n.t('sessionExpired'),
            ),
            {
                placement: 'top-center',
            },
        )
    } catch (error) {
        toast.push(
            createElement(
                Notification,
                {
                    title: 'Error',
                    type: 'danger',
                    duration: 3000,
                    closable: true,
                },
                'An unexpected error occurred.',
            ),
            {
                placement: 'top-center',
            },
        )
        throw error
    }
}

BaseService.interceptors.request.use(
    (config) => {
        const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
        let accessToken = null

        try {
            const persistData = deepParseJson(rawPersistData)
            if (persistData && (persistData as any).auth?.session?.token) {
                accessToken = (persistData as any).auth.session.token
            }
        } catch (error) {
            console.error('Error parsing persist data', error)
        }

        if (!accessToken) {
            const { auth } = store.getState()
            accessToken = auth?.session?.token
        }

        if (accessToken) {
            config.headers[REQUEST_HEADER_AUTH_KEY] =
                `${TOKEN_TYPE}${accessToken}`
        }

        return config
    },
    (error) => {
        toast.push(
            createElement(
                Notification,
                {
                    title: 'Error',
                    type: 'danger',
                    duration: 3000,
                    closable: true,
                },
                'An unexpected error occurred.',
            ),
            {
                placement: 'top-center',
            },
        )
        return Promise.reject(error)
    },
)

BaseService.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        try {
            const { response, code } = error

            // Handle authentication errors
            if (response && unauthorizedCode.includes(response.status)) {
                store.dispatch(signOutSuccess())
                handleSignOut()
                return Promise.reject(error)
            }

            // Handle network errors
            if (code === 'ERR_NETWORK') {
                toast.push(
                    createElement(
                        Notification,
                        {
                            title: 'Connection Error',
                            type: 'danger',
                            duration: 5000,
                            closable: true,
                        },
                        'Unable to connect to the server. Please check your internet connection and try again.',
                    ),
                    {
                        placement: 'top-center',
                    },
                )
                return Promise.reject(error)
            }

            // Handle other API errors with response
            if (response && response.data && response.data.message) {
                toast.push(
                    createElement(
                        Notification,
                        {
                            title: 'Error',
                            type: 'warning',
                            duration: 3000,
                            closable: true,
                        },
                        response.data.message,
                    ),
                    {
                        placement: 'top-center',
                    },
                )
            }
        } catch (err) {
            toast.push(
                createElement(
                    Notification,
                    {
                        title: 'Error',
                        type: 'danger',
                        duration: 3000,
                        closable: true,
                    },
                    'An unexpected error occurred.',
                ),
                {
                    placement: 'top-center',
                },
            )
        }

        return Promise.reject(error)
    },
)

export default BaseService
