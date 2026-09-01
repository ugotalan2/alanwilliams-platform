import { useEffect, useState } from 'react'
import { useAuth, useClerk } from '@clerk/react'

import agendaIcon from '../styles/icons/agenda-icon.png'
import budgetIcon from '../styles/icons/budget-icon.png'
import choreIcon from '../styles/icons/chore-icon.png'
import fitnessIcon from '../styles/icons/fitness-icon.png'

import {
    buildAppUrl,
    type AppSubdomain,
} from '../lib/appUrls'

type AppKey =
    | 'platform'
    | 'agenda'
    | 'budget'
    | 'chores'
    | 'fitness'

type AppStatus =
    | 'AVAILABLE'
    | 'COMING_SOON'

interface CatalogApp {
    appKey: AppKey
    name: string
    subdomain: AppSubdomain
    status: AppStatus
}

const appDetails: Record<
    Exclude<AppKey, 'platform'>,
    {
        description: string
        icon: string
    }
> = {
    agenda: {
        description:
            'Plan meetings, guide discussions, track assignments, and follow up on the work that matters.',
        icon: agendaIcon,
    },
    budget: {
        description:
            'Manage personal and family finances with a focused, connected budgeting experience.',
        icon: budgetIcon,
    },
    chores: {
        description:
            'Organize household responsibilities and keep recurring work visible and manageable.',
        icon: choreIcon,
    },
    fitness: {
        description:
            'Create and track fitness workouts and progress.',
        icon: fitnessIcon,
    },
}

function HomePage() {
    const { isLoaded, isSignedIn } = useAuth()
    const { openSignIn } = useClerk()

    const [apps, setApps] = useState<CatalogApp[]>([])
    const [loadingApps, setLoadingApps] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function loadApps() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/apps`
                )

                if (!response.ok) {
                    throw new Error(
                        `Unable to load apps (${response.status})`
                    )
                }

                const data =
                    (await response.json()) as CatalogApp[]

                if (!cancelled) {
                    setApps(data)
                }
            } catch (error) {
                console.error(
                    'Unable to load app catalog',
                    error
                )
            } finally {
                if (!cancelled) {
                    setLoadingApps(false)
                }
            }
        }

        void loadApps()

        return () => {
            cancelled = true
        }
    }, [])

    const appCards = apps.filter(
        (app) => app.appKey !== 'platform'
    )

    const availableApps = appCards.filter(
        (app) => app.status === 'AVAILABLE'
    )

    const comingSoonApps = appCards.filter(
        (app) => app.status === 'COMING_SOON'
    )

    function renderAppCard(
        app: CatalogApp,
        available: boolean
    ) {
        if (app.appKey === 'platform') {
            return null
        }

        const details = appDetails[app.appKey]

        const card = (
            <div className="aw-card h-100 p-4">
                <div className="aw-app-icon mb-3">
                    <span className="aw-logo-container aw-theme-preview-logo-container">
                        <img
                            src={details.icon}
                            alt=""
                            className="aw-app-logo"
                        />
                    </span>
                </div>

                <h3 className="h4">
                    {app.name}
                </h3>

                <p className="aw-text-muted mb-0">
                    {details.description}
                </p>
            </div>
        )

        if (!available) {
            return card
        }

        return (
            <a
                href={buildAppUrl(app.subdomain)}
                className="aw-app-card-link d-block h-100"
            >
                {card}
            </a>
        )
    }

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
                                Simple tools for meetings, budgets,
                                household organization, and more —
                                designed to work together while
                                staying focused on the job each app
                                does best.
                            </p>

                            {isLoaded && !isSignedIn && (
                                <button
                                    type="button"
                                    className="btn aw-btn-accent btn-lg"
                                    onClick={() => openSignIn()}
                                >
                                    Sign In / Sign Up
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {!loadingApps && (
                <>
                    {availableApps.length > 0 && (
                        <section className="pb-5">
                            <div className="container">
                                <h2 className="fw-bold mb-4 text-center">
                                    Available Apps
                                </h2>

                                <div className="row g-3 justify-content-center">
                                    {availableApps.map((app) => (
                                        <div
                                            key={app.appKey}
                                            className="col-12 col-md-4"
                                        >
                                            {renderAppCard(app, true)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {comingSoonApps.length > 0 && (
                        <section className="py-5 aw-section-muted">
                            <div className="container">
                                <h2 className="fw-bold mb-4 text-center">
                                    Coming Soon
                                </h2>

                                <div className="row g-3 justify-content-center">
                                    {comingSoonApps.map((app) => (
                                        <div
                                            key={app.appKey}
                                            className="col-12 col-md-4"
                                        >
                                            {renderAppCard(app, false)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 text-center">
                            <h2 className="fw-bold mb-3">
                                Built to feel connected
                            </h2>

                            <p className="aw-text-muted mb-0">
                                Sign in once, keep the same profile
                                and appearance across your apps, and
                                move between the tools you use
                                without each one feeling like a
                                separate system.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage