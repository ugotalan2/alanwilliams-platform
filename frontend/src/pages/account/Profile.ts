export type AppearanceMode = 'SYSTEM' | 'LIGHT' | 'DARK'

export type Profile = {
    id: number
    name: string
    notificationEmail: string | null
    timeZone: string | null
    appearanceMode: AppearanceMode
    status: 'ACTIVE' | 'INACTIVE' | 'MERGED'
}