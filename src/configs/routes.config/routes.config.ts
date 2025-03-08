import type { Routes } from '@/@types/routes'
import { lazy } from 'react'
import authRoute from './authRoute'
import testRoute from './testRoute'

export const publicRoutes: Routes = [...authRoute, ...testRoute]

export const protectedRoutes: Routes = [
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
    {
        key: 'drug',
        path: '/drug',
        component: lazy(() => import('@/views/drug/list/DrugList')),
        authority: [],
        meta: {
            layout: 'modern',
        },
    },
    {
        key: 'drugDetail',
        path: '/drug/:drugId',
        component: lazy(() => import('@/views/drug/detail/DrugDetail')),
        authority: [],
        meta: {
            layout: 'modern',
        },
    },

    {
        key: 'user',
        path: '/user',
        component: lazy(() => import('@/views/user/list/UserList')),
        authority: [],
        meta: {
            layout: 'modern',
        },
    },
    {
        key: 'userDetail',
        path: '/user/:id',
        component: lazy(() => import('@/views/user/detail/UserDetail')),
        authority: [],
        meta: {
            layout: 'modern',
        },
    },
]
