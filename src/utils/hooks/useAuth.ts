import type {
    BaseGetResponse,
    SignInCredential,
    SignUpCredential,
} from '@/@types/auth'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { apiSignIn, apiSignUp } from '@/services/AuthService'
import {
    initialUserState,
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppDispatch,
    useAppSelector,
} from '@/store'
import { useNavigate } from 'react-router-dom'
import decodeJwt from '../decodedJWT'
import useQuery from './useQuery'

export type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const authenticateUser = (
        token: string,
        response?: Record<string, unknown>,
    ): { status: Status; message: string } => {
        if (response?.status === 403 || response?.status === 401) {
            handleSignOut()
            return {
                status: 'failed',
                message: 'Unauthorized access. Redirecting to login.',
            }
        }

        dispatch(signInSuccess(token))
        const user = decodeJwt(token)
        if (user) {
            dispatch(setUser({ ...user } as any))
        }

        return {
            status: 'success',
            message: '',
        }
    }

    const signIn = async (
        values: SignInCredential,
    ): Promise<BaseGetResponse | undefined> => {
        const { email, password } = values
        // const encryptedPassword = (await encrypt(password)) || ''
        try {
            const response = await apiSignIn({
                email,
                password,
            })
            if (response) {
                const token = response.data.token as unknown as string
                return authenticateUser(token, {
                    ...response,
                })
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token))
                if (resp.data.user) {
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                userName: 'Anonymous',
                                authority: ['USER'],
                                email: '',
                            },
                        ),
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl
                        ? redirectUrl
                        : appConfig.authenticatedEntryPath,
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(setUser(initialUserState))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        // await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
