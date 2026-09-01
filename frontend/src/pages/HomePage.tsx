import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import agendaIcon from '../styles/icons/agenda-icon.png'
import budgetIcon from '../styles/icons/budget-icon.png'
import choreIcon from '../styles/icons/chore-icon.png'
import fitnessIcon from '../styles/icons/fitness-icon.png'
import { useAuth, useClerk } from '@clerk/react'

function HomePage() {

    const { isLoaded, isSignedIn } = useAuth()
    const { openSignIn } = useClerk()

    return (
        <>
            <section className="aw-hero">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12 col-lg-9 col-xl-8 text-center">
                            <h1 className="display-4 fw-bold mb-3">
                                AlanWilliams Apps
                            </h1>

                            <p className="h3 fw-semibold mb-3">
                                One account. Connected apps.
                            </p>

                            <p className="lead aw-text-muted mb-4 mx-auto aw-hero-copy">
                                Simple tools for meetings, budgets, household organization,
                                and more — designed to work together while staying focused on
                                the job each app does best.
                            </p>

                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                                <Link to="/apps" className="btn aw-btn-accent btn-lg">
                                    Explore Apps
                                    <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                                </Link>

                                {isLoaded && !isSignedIn && (
                                    <button
                                        type="button"
                                        className="btn aw-btn-secondary btn-lg"
                                        onClick={() => openSignIn()}
                                    >
                                        Sign In / Sign Up
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-5">
                <div className="container">
                    <div className="row g-3">
                        <div className="col-12 col-md-4">
                            <div className="aw-card h-100 p-4">
                                <div className="aw-app-icon mb-3">
                                    <span className="aw-logo-container aw-theme-preview-logo-container">
                                        <img
                                            src={agendaIcon}
                                            alt=""
                                            className="aw-app-logo"
                                        />
                                    </span>
                                </div>

                                <h2 className="h4">Agenda</h2>

                                <p className="aw-text-muted mb-0">
                                    Plan meetings, guide discussions, track assignments, and
                                    follow up on the work that matters.
                                </p>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="aw-card h-100 p-4">
                                <div className="aw-app-icon mb-3">
                                    <span className="aw-logo-container aw-theme-preview-logo-container">
                                        <img
                                            src={budgetIcon}
                                            alt=""
                                            className="aw-app-logo"
                                        />
                                    </span>
                                </div>

                                <h2 className="h4">Budget</h2>

                                <p className="aw-text-muted mb-0">
                                    Manage personal and family finances with a focused,
                                    connected budgeting experience.
                                </p>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="aw-card h-100 p-4">
                                <div className="aw-app-icon mb-3">
                                    <span className="aw-logo-container aw-theme-preview-logo-container">
                                        <img
                                            src={choreIcon}
                                            alt=""
                                            className="aw-app-logo"
                                        />
                                    </span>
                                </div>

                                <h2 className="h4">Chores</h2>

                                <p className="aw-text-muted mb-0">
                                    Organize household responsibilities and keep recurring work
                                    visible and manageable.
                                </p>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="aw-card h-100 p-4">
                                <div className="aw-app-icon mb-3">
                                    <span className="aw-logo-container aw-theme-preview-logo-container">
                                        <img
                                            src={fitnessIcon}
                                            alt=""
                                            className="aw-app-logo"
                                        />
                                    </span>
                                </div>

                                <h2 className="h4">Fitness</h2>

                                <p className="aw-text-muted mb-0">
                                    Create and track fitness workouts and progress.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 aw-section-muted">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 text-center">
                            <h2 className="fw-bold mb-3">Built to feel connected</h2>

                            <p className="aw-text-muted mb-0">
                                Sign in once, keep the same profile and appearance across your
                                apps, and move between the tools you use without each one
                                feeling like a separate system.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage