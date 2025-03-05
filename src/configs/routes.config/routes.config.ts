import type { Routes } from '@/@types/routes'
import { lazy } from 'react'
import authRoute from './authRoute'
import testRoute from './testRoute'

export const publicRoutes: Routes = [...authRoute, ...testRoute]

export const protectedRoutes = [
    // Example purpose only, please remove this line
    // ...testRoute,
    {
        key: 'dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/dashboard/Dashboard')),
        authority: [],
        meta: {
            layout: 'modern',
        },
    },
]
