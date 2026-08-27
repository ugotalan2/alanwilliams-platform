import { Outlet } from 'react-router-dom'
import PublicHeader from './PublicHeader'

function PublicLayout() {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <PublicHeader />

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <footer className="border-top py-4 mt-auto">
                <div className="container">
                    <div className="small text-center aw-text-muted">
                        © AlanWilliams Apps
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default PublicLayout