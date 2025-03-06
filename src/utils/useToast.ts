import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import React, { ReactNode, useCallback } from 'react'

interface ToastOptions {
    title?: string
    children: ReactNode
    type?: 'success' | 'danger' | 'warning' | 'info'
    duration?: number
}

type ShowToastFunction = (options: ToastOptions) => void

const useToast = (): ShowToastFunction => {
    const showToast = useCallback(
        ({ title, children, type = 'info', duration = 3000 }: ToastOptions) => {
            toast.push(
                React.createElement(
                    Notification,
                    { title, type, duration, closable: true },
                    children,
                ),
                {
                    placement: 'top-end',
                },
            )
        },
        [],
    )

    return showToast
}

export default useToast
