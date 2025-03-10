import { Button, Spinner } from '@/components/ui'
import { signInWithGoogle } from '@/services/AuthService'
import useAuth from '@/utils/hooks/useAuth'
import useToast from '@/utils/useToast'
import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { FcGoogle } from 'react-icons/fc'

const GoogleSignIn = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { googleSignIn } = useAuth()
    const toast = useToast()

    const handleSignIn = useCallback(async (): Promise<void> => {
        if (isLoading) return

        setIsLoading(true)
        try {
            const result = await signInWithGoogle()

            if (!result.success || !result.idToken) {
                throw new Error(
                    result.message || 'Failed to authenticate with Google',
                )
            }

            const authResult = await googleSignIn(result.idToken)

            if (authResult?.status === 'failed') {
                throw new Error(
                    authResult.message || 'Backend authentication failed',
                )
            }
        } catch (err) {
            const errorMessage =
                (err as Error).message || 'An error occurred during sign in'
            toast({
                title: 'Error',
                children: errorMessage,
                type: 'danger',
            })
        } finally {
            setIsLoading(false)
        }
    }, [googleSignIn, isLoading, toast])

    return (
        <motion.div
            className="flex flex-col justify-center items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Button
                icon={isLoading ? <Spinner size={20} /> : <FcGoogle />}
                onClick={handleSignIn}
                disabled={isLoading}
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-50 transition duration-300 flex items-center"
            >
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
        </motion.div>
    )
}

export default GoogleSignIn
