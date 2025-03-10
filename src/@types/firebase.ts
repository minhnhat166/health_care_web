import { AuthError, IdTokenResult, User, UserInfo } from 'firebase/auth'

export type FirebaseUser = User
export type FirebaseUserInfo = UserInfo
export type FirebaseIdTokenResult = IdTokenResult
export type FirebaseAuthError = AuthError

export type AuthStateListener = (user: FirebaseUser | null) => void

export interface AuthResponse {
    user: FirebaseUser
    credential?: {
        accessToken?: string
        idToken?: string
        providerId: string
    }
}

export interface AuthProviderOptions {
    provider: string
    scopes?: string[]
    customParameters?: Record<string, string>
}

export interface AuthServiceResponse {
    success: boolean
    user?: FirebaseUser
    idToken?: string
    message?: string
    error?: Error
    errorCode?: string
}
