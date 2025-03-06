import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { authenticated } = useAuth()

    if (!authenticated) {
        return <Outlet />
    }

    return <Navigate to={authenticatedEntryPath} />
}

export default PublicRoute
