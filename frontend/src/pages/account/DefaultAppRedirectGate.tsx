import {
    type ReactNode,
    useEffect,
    useRef,
} from 'react'
import { useAuth } from '@clerk/react'
import { useProfile } from './useProfile'
import { buildAppUrl, type AppSubdomain } from '../../lib/appUrls'
import { getValidatedPlatformReturnTo } from '../../utils/platformReturnTo'

type DefaultAppRedirectGateProps = {
    children: ReactNode
}

type PersonApp = {
    appKey: string
    subdomain: AppSubdomain
    defaultApp: boolean
}

function DefaultAppRedirectGate({
    children,
}: DefaultAppRedirectGateProps) {
    const { isLoaded, isSignedIn, getToken } = useAuth()
    const {
        profile,
        loading,
        needsOnboarding,
    } = useProfile()

    const redirectStarted = useRef(false)

    useEffect(() => {
        if (
            redirectStarted.current
            || !isLoaded
            || !isSignedIn
            || loading
            || needsOnboarding
            || !profile
            || window.location.pathname !== '/'
        ) {
            return
        }

        const returnTo = getValidatedPlatformReturnTo(
            new URLSearchParams(window.location.search).get('returnTo'),
        )

        if (returnTo) {
            redirectStarted.current = true
            window.location.replace(returnTo)
            return
        }

        let cancelled = false

        async function redirectToDefaultApp() {
            try {
                const token = await getToken()

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/account/apps`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )

                if (!response.ok) {
                    return
                }

                const apps =
                    (await response.json()) as PersonApp[]

                const defaultApp = apps.find(
                    (app) => app.defaultApp
                )

                if (
                    cancelled
                    || !defaultApp
                    || defaultApp.appKey === 'platform'
                ) {
                    return
                }

                redirectStarted.current = true

                window.location.replace(
                    buildAppUrl(defaultApp.subdomain)
                )
            } catch (error) {
                console.error(
                    'Unable to redirect to default app',
                    error,
                )
            }
        }

        void redirectToDefaultApp()

        return () => {
            cancelled = true
        }
    }, [
        getToken,
        isLoaded,
        isSignedIn,
        loading,
        needsOnboarding,
        profile,
    ])

    return <>{children}</>
}

export default DefaultAppRedirectGate
