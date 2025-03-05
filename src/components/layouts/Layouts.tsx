import Loading from '@/components/shared/Loading'
import {
    LAYOUT_TYPE_BLANK,
    LAYOUT_TYPE_CLASSIC,
    LAYOUT_TYPE_DECKED,
    LAYOUT_TYPE_MODERN,
    LAYOUT_TYPE_SIMPLE,
    LAYOUT_TYPE_STACKED_SIDE,
} from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'
import useDirection from '@/utils/hooks/useDirection'
import useLocale from '@/utils/hooks/useLocale'
import { lazy, memo, Suspense, useMemo } from 'react'

const layouts = {
    [LAYOUT_TYPE_CLASSIC]: lazy(() => import('./ClassicLayout')),
    [LAYOUT_TYPE_MODERN]: lazy(() => import('./ModernLayout')),
    [LAYOUT_TYPE_STACKED_SIDE]: lazy(() => import('./StackedSideLayout')),
    [LAYOUT_TYPE_SIMPLE]: lazy(() => import('./SimpleLayout')),
    [LAYOUT_TYPE_DECKED]: lazy(() => import('./DeckedLayout')),
    [LAYOUT_TYPE_BLANK]: lazy(() => import('./BlankLayout')),
}

// Move AuthLayout outside to avoid recreating it on every render
const AuthLayout = lazy(() => import('./AuthLayout'))

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex flex-auto flex-col h-[100vh]">
        <Loading loading={true} />
    </div>
)

const Layout = () => {
    const layoutType = useAppSelector((state) => state.theme.layout.type)
    const { authenticated } = useAuth()

    // Call hooks once per render
    useDirection()
    useLocale()

    const AppLayout = useMemo(() => {
        if (authenticated) {
            return layouts[layoutType]
        }
        return AuthLayout
    }, [layoutType, authenticated])

    return (
        <Suspense fallback={<LoadingFallback />}>
            <AppLayout />
        </Suspense>
    )
}

// Use memo to prevent unnecessary re-renders
export default memo(Layout)
