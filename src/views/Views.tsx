import type { LayoutType } from '@/@types/theme'
import AppRoute from '@/components/route/AppRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import Loading from '@/components/shared/Loading'
import PageContainer from '@/components/template/PageContainer'
import appConfig from '@/configs/app.config'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import { useAppSelector } from '@/store'
import React, { Suspense, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

const { authenticatedEntryPath } = appConfig

const ProtectedRoutesList = React.memo(({ props }: { props: ViewsProps }) => {
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    return useMemo(
        () => (
            <>
                <Route
                    path="/"
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={userAuthority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.meta}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </>
        ),
        [userAuthority, props],
    )
})

const PublicRoutesList = React.memo(() => {
    return useMemo(
        () =>
            publicRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        <AppRoute
                            routeKey={route.key}
                            component={route.component}
                            {...route.meta}
                        />
                    }
                />
            )),
        [],
    )
})

const AllRoutes = React.memo((props: ViewsProps) => {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute />}>
                <ProtectedRoutesList props={props} />
            </Route>
            <Route path="/" element={<PublicRoute />}>
                <PublicRoutesList />
            </Route>
        </Routes>
    )
})

const Views = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
