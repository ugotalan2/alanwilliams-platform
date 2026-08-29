import { createContext } from 'react'
import type { AppearanceMode, Profile } from './Profile'

export type ProfileContextValue = {
    profile: Profile | null
    loading: boolean
    error: string | null
    updateProfile: (updates: Partial<{
        name: string
        notificationEmail: string
        timeZone: string
        appearanceMode: AppearanceMode
    }>) => Promise<Profile>
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)