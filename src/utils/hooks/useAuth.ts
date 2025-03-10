import type {
    BaseGetResponse,
    SignInCredential,
    SignUpCredential,
} from '@/@types/auth'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import {
    apiGoogleLogin,
    apiSignIn,
    apiSignUp,
    logOut,
} from '@/services/AuthService'
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
        // Encrypt password before sending to server
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
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const googleSignIn = async (tokenId: string) => {
        try {
            const response = (await apiGoogleLogin({
                idToken: tokenId,
            })) as { data: { token: string } }

            if (response && response.data) {
                const token = response.data.token
                return authenticateUser(token, {
                    ...response,
                })
            } else {
                return {
                    status: 'failed',
                    message: 'Invalid response from server',
                }
            }
        } catch (errors: any) {
            const errorMessage =
                errors?.response?.data?.message ||
                errors?.message ||
                'Authentication failed'
            const errorStatus = errors?.response?.status || 500

            return {
                status: 'failed',
                message: errorMessage,
                statusCode: errorStatus,
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
        await logOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
        googleSignIn,
    }
}

export default useAuth
