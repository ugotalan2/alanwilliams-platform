import { useAuth, useClerk } from '@clerk/react'
import {
    AppHeader,
    AppearanceMenu,
} from '@ugotalan2/ui'

import alanWilliamsIcon from '../../styles/icons/alanwilliams-icon.png'
import alanWilliamsIconDark from '../../styles/icons/alanwilliams-icon-white.png'

import AccountMenu from '../account/AccountMenu'

function PublicHeader() {
    const { isLoaded, isSignedIn } = useAuth()
    const { openSignIn } = useClerk()

    return (
        <AppHeader
            brandLabel="AlanWilliams Apps"
            brandTo="/"
            lightLogoSrc={alanWilliamsIcon}
            darkLogoSrc={alanWilliamsIconDark}
            navigation={[
                {
                    label: 'About',
                    to: '/about',
                },
                {
                    label: 'Contact',
                    to: '/contact',
                },
            ]}
            authLoaded={isLoaded}
            signedIn={isSignedIn}
            signedOutMenu={<AppearanceMenu />}
            signedInMenu={<AccountMenu />}
            onSignIn={() => openSignIn()}
            collapseId="publicNavbar"
        />
    )
}

export default PublicHeader