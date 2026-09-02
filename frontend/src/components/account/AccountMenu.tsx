import { useAuth } from '@clerk/react'
import {
    useLocation,
    useNavigate,
} from 'react-router-dom'
import {
    AccountMenu as SharedAccountMenu,
    type ThemePreference,
} from '@ugotalan2/ui'
import {
    buildReturnTo,
    withReturnTo,
} from '../../utils/returnTo'
import { useProfile } from '../../pages/account/useProfile'
import type { AppearanceMode } from '../../pages/account/Profile'

function AccountMenu() {
    const { signOut } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const { updateProfile } = useProfile()

    const returnTo = buildReturnTo(
        location.pathname,
        location.search,
    )

    const navigateToAccount = (path: string) => {
        navigate(withReturnTo(path, returnTo))
    }

    const saveAppearance = async (
        preference: ThemePreference,
    ) => {
        const appearanceMode: AppearanceMode =
            preference === 'system'
                ? 'SYSTEM'
                : preference === 'light'
                    ? 'LIGHT'
                    : 'DARK'

        await updateProfile({
            appearanceMode,
        })
    }

    return (
        <SharedAccountMenu
            onProfile={() =>
                navigateToAccount('/account/profile')
            }
            onApps={() =>
                navigateToAccount('/account/apps')
            }
            onAppearanceChange={saveAppearance}
            onSignOut={() => signOut()}
        />
    )
}

export default AccountMenu