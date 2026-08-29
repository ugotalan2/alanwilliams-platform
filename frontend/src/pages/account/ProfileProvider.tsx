import {
    type ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react'
import { useAuth } from '@clerk/react'
import { ProfileContext } from './ProfileContext'
import type { AppearanceMode, Profile } from './Profile'
import { useTheme } from '../../theme/useTheme'

type ProfileProviderProps = {
    children: ReactNode
}

type ProfileUpdates = Partial<{
    name: string
    notificationEmail: string
    timeZone: string
    appearanceMode: AppearanceMode
}>

function toThemePreference(
    appearanceMode: AppearanceMode
): 'system' | 'light' | 'dark' {
    switch (appearanceMode) {
        case 'LIGHT':
            return 'light'
        case 'DARK':
            return 'dark'
        case 'SYSTEM':
        default:
            return 'system'
    }
}

function ProfileProvider({ children }: ProfileProviderProps) {
    const { isLoaded, isSignedIn, getToken } = useAuth()
    const { setPreference } = useTheme()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadProfile = useCallback(async () => {
        if (!isLoaded) {
            return
        }

        if (!isSignedIn) {
            setProfile(null)
            setLoading(false)
            setError(null)
            return
        }

        try {
            setLoading(true)
            setError(null)

            const token = await getToken()

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                const body = await response.json().catch(() => null)

                throw new Error(
                    body?.error ??
                    `Unable to load profile (${response.status})`
                )
            }

            const loadedProfile: Profile = await response.json()

            setProfile(loadedProfile)
            setPreference(
                toThemePreference(loadedProfile.appearanceMode)
            )
        } catch (err) {
            setProfile(null)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to load profile'
            )
        } finally {
            setLoading(false)
        }
    }, [getToken, isLoaded, isSignedIn,setPreference,])

    useEffect(() => {
        void loadProfile()
    }, [loadProfile])

    async function updateProfile(
        updates: ProfileUpdates
    ): Promise<Profile> {
        const token = await getToken()

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/me`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            }
        )

        if (!response.ok) {
            const body = await response.json().catch(() => null)

            throw new Error(
                body?.error ??
                `Unable to update profile (${response.status})`
            )
        }

        const updatedProfile: Profile = await response.json()

        setProfile(updatedProfile)

        return updatedProfile
    }

    return (
        <ProfileContext.Provider
            value={{
                profile,
                loading,
                error,
                updateProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileProvider