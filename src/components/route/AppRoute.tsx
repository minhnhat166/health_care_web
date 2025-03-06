import { useEffect, useCallback, useMemo } from 'react'
import {
    setLayout,
    setPreviousLayout,
    setCurrentRouteKey,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import { useLocation } from 'react-router-dom'
import type { LayoutType } from '@/@types/theme'
import type { ComponentType } from 'react'

export type AppRouteProps<T extends Record<string, unknown>> = {
    component: ComponentType<T>
    routeKey: string
    layout?: LayoutType
}

const AppRoute = <T extends Record<string, unknown>>({
    component: Component,
    routeKey,
    ...props
}: AppRouteProps<T>) => {
    const location = useLocation()
    const dispatch = useAppDispatch()

    // Use more specific selectors to prevent unnecessary re-renders
    const layoutType = useAppSelector((state) => state.theme.layout.type)
    const previousLayout = useAppSelector(
        (state) => state.theme.layout.previousType,
    )

    const handleLayoutChange = useCallback(() => {
        dispatch(setCurrentRouteKey(routeKey))

        const currentLayout = props.layout

        if (currentLayout && currentLayout !== layoutType) {
            // Change to new layout
            dispatch(setPreviousLayout(layoutType))
            dispatch(setLayout(currentLayout))
        } else if (
            !currentLayout &&
            previousLayout &&
            layoutType !== previousLayout
        ) {
            // Revert to previous layout
            dispatch(setLayout(previousLayout))
            dispatch(setPreviousLayout(''))
        }
    }, [dispatch, layoutType, previousLayout, props.layout, routeKey])

    useEffect(() => {
        handleLayoutChange()
    }, [location, handleLayoutChange])

    // Keep component props memoized to avoid unnecessary re-renders
    const componentProps = useMemo(() => props as T, [props])

    return <Component {...componentProps} />
}

export default AppRoute
