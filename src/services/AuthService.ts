import type {
    ForgotPassword,
    ResetPassword,
    SignInCredential,
    SignInResponse,
    SignUpCredential,
    SignUpResponse,
} from '@/@types/auth'
import { AuthServiceResponse, AuthStateListener } from '@/@types/firebase'
import { auth, provider } from '@/firebase/firebase.config'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import ApiService from './ApiService'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchData<SignInResponse>({
        url: '/api/auth/login',
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/api/auth/register',
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/api/auth/sign-out',
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/api/auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    return ApiService.fetchData({
        url: '/api/auth/reset-password',
        method: 'post',
        data,
    })
}

export const apiRefreshToken = async <T, U extends Record<string, unknown>>(
    data: U,
) => {
    return ApiService.fetchData<T>({
        url: '/api/auth/refresh-token',
        method: 'post',
        data,
    })
}

export const apiGoogleLogin = async <T, U extends Record<string, unknown>>(
    data: U,
) => {
    return ApiService.fetchData<T>({
        url: '/api/auth/google-login',
        method: 'post',
        data,
    })
}

export const signInWithGoogle = async (): Promise<AuthServiceResponse> => {
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        const idToken = await user.getIdToken(true)
        return {
            success: true,
            user,
            idToken,
        }
    } catch (error) {
        return {
            success: false,
            error: error as Error,
            message: (error as Error).message,
        }
    }
}

export const logOut = async (): Promise<AuthServiceResponse> => {
    try {
        await signOut(auth)
        return {
            success: true,
            message: 'Successfully signed out',
        }
    } catch (error) {
        return {
            success: false,
            error: error as Error,
            message: (error as Error).message,
        }
    }
}

export const onAuthStateChangedListener = (
    callback: AuthStateListener,
): (() => void) => {
    return onAuthStateChanged(auth, callback)
}
