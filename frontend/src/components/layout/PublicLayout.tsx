import { Outlet } from 'react-router-dom'
import { AppFooter } from '@ugotalan2/ui'
import PublicHeader from './PublicHeader'

function PublicLayout() {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <PublicHeader />

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <AppFooter
                links={[
                    {
                        label: 'Privacy',
                        to: '/privacy',
                    },
                    {
                        label: 'Terms',
                        to: '/terms',
                    },
                    {
                        label: 'Contact',
                        to: '/contact',
                    },
                ]}
            />
        </div>
    )
}

export default PublicLayout