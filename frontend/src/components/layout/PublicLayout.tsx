import { NavLink, Outlet } from 'react-router-dom'
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
                    <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2 gap-sm-3 small aw-text-muted">
                        <span>© AlanWilliams Apps</span>

                        <NavLink to="/privacy" className="aw-text-muted">
                            Privacy
                        </NavLink>

                        <NavLink to="/terms" className="aw-text-muted">
                            Terms
                        </NavLink>

                        <NavLink to="/contact" className="aw-text-muted">
                            Contact
                        </NavLink>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default PublicLayout