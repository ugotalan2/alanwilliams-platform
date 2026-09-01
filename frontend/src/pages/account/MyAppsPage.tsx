import { useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft,
    faArrowRight,
    faGripVertical,
    faStar,
} from '@fortawesome/free-solid-svg-icons'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'

import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'
import { buildAppUrl, type AppSubdomain, } from '../../lib/appUrls'

import { useLocation, useNavigate, } from 'react-router-dom'

type AppKey =
    | 'platform'
    | 'agenda'
    | 'budget'
    | 'chores'
    | 'fitness'

type AppStatus =
    | 'AVAILABLE'
    | 'COMING_SOON'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface PersonApp {
    appKey: AppKey
    name: string
    subdomain: AppSubdomain
    status: AppStatus
    enabled: boolean
    sortOrder: number
    defaultApp: boolean
}

interface SortableAppRowProps {
    app: PersonApp
    onEnabledChange: (app: PersonApp) => void
    onDefaultChange: (app: PersonApp) => void
}

function SortableAppRow({
                            app,
                            onEnabledChange,
                            onDefaultChange,
                        }: SortableAppRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: app.appKey,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
    }

    const themeClass = {
        platform: 'aw-theme-platform',
        agenda: 'aw-theme-agenda',
        budget: 'aw-theme-budget',
        chores: 'aw-theme-chores',
        fitness: 'aw-theme-fitness',
    }[app.appKey]

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`aw-my-app-row ${themeClass} ${
                isDragging ? 'dragging' : ''
            }`}
        >
            <input
                type="checkbox"
                className="aw-my-app-checkbox"
                checked={app.enabled}
                onChange={() => onEnabledChange(app)}
                aria-label={`Show ${app.name} in app menu`}
            />

            <span className="aw-my-app-name">
                {app.name}
            </span>

            <button
                type="button"
                className="aw-my-app-star"
                onClick={() => onDefaultChange(app)}
                aria-label={`Make ${app.name} the default app`}
                title="Default app"
            >
                <FontAwesomeIcon
                    icon={faStar}
                    className={`aw-my-app-star-icon ${
                        app.defaultApp ? 'selected' : ''
                    }`}
                />
            </button>

            <button
                type="button"
                className="aw-my-app-drag"
                aria-label={`Drag ${app.name} to reorder`}
                title="Drag to reorder"
                {...attributes}
                {...listeners}
            >
                <FontAwesomeIcon icon={faGripVertical} />
            </button>
        </div>
    )
}

function MyAppsPage() {
    const { getToken } = useAuth()

    const [apps, setApps] = useState<PersonApp[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
    const location = useLocation()
    const navigate = useNavigate()

    const returnTo = new URLSearchParams(location.search)
        .get('returnTo')

    const validReturnTo =
        returnTo &&
        returnTo.startsWith('/') &&
        !returnTo.startsWith('//') &&
        returnTo !== '/account/apps'
            ? returnTo
            : null

    const defaultApp = apps.find(
        (app) => app.defaultApp
    )

    const availableApps = apps.filter(
        (app) => app.status === 'AVAILABLE'
    )

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        })
    )

    useEffect(() => {
        let cancelled = false

        async function loadApps() {
            try {
                setLoading(true)
                setError(null)

                const token = await getToken()

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/account/apps`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )

                if (!response.ok) {
                    throw new Error(
                        `Unable to load apps (${response.status})`,
                    )
                }

                const data =
                    (await response.json()) as PersonApp[]

                if (!cancelled) {
                    setApps(data)
                }
            } catch (err) {
                console.error(
                    'Unable to load app preferences',
                    err,
                )

                if (!cancelled) {
                    setError(
                        'Unable to load your app settings.',
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        void loadApps()

        return () => {
            cancelled = true
        }
    }, [getToken])

    async function updateApps(
        path: string,
        body?: unknown
    ): Promise<PersonApp[]> {
        setSaveStatus('saving')

        try {
            const token = await getToken()

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}${path}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: body
                        ? JSON.stringify(body)
                        : undefined,
                }
            )

            if (!response.ok) {
                throw new Error('Unable to save app settings')
            }

            const updatedApps =
                (await response.json()) as PersonApp[]

            setSaveStatus('saved')

            window.setTimeout(() => {
                setSaveStatus((current) =>
                    current === 'saved'
                        ? 'idle'
                        : current
                )
            }, 2000)

            return updatedApps
        } catch (error) {
            setSaveStatus('error')
            throw error
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over || active.id === over.id) {
            return
        }

        const oldIndex = availableApps.findIndex(
            (app) => app.appKey === active.id
        )

        const newIndex = availableApps.findIndex(
            (app) => app.appKey === over.id
        )

        if (oldIndex === -1 || newIndex === -1) {
            return
        }

        const reorderedAvailableApps = arrayMove(
            availableApps,
            oldIndex,
            newIndex
        )

        /*
         * Replace only the AVAILABLE app positions.
         * COMING_SOON apps retain their existing positions in
         * the complete backend preference order.
         */
        let availableIndex = 0

        const reorderedApps = apps.map((app) => {
            if (app.status !== 'AVAILABLE') {
                return app
            }

            return reorderedAvailableApps[availableIndex++]
        })

        setApps(reorderedApps)

        try {
            const updatedApps = await updateApps(
                '/account/apps/order',
                {
                    appKeys: reorderedApps.map(
                        (app) => app.appKey
                    ),
                }
            )

            setApps(updatedApps)
        } catch (error) {
            console.error(error)
            setApps(apps)
        }
    }

    async function handleEnabledChange(app: PersonApp) {
        try {
            const updatedApps = await updateApps(
                `/account/apps/${app.appKey}/enabled`,
                {
                    enabled: !app.enabled,
                }
            )

            setApps(updatedApps)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleDefaultChange(app: PersonApp) {
        try {
            const updatedApps = await updateApps(
                `/account/apps/${app.appKey}/default`
            )

            setApps(updatedApps)
        } catch (error) {
            console.error(error)
        }
    }

    function handleBack() {
        if (validReturnTo) {
            navigate(validReturnTo)
        }
    }

    function handleContinue() {
        if (!defaultApp) {
            navigate('/')
            return
        }

        if (defaultApp.appKey === 'platform') {
            navigate('/')
            return
        }

        window.location.assign(
            buildAppUrl(defaultApp.subdomain)
        )
    }

    if (loading) {
        return (
            <div className="container py-5">
                <p className="aw-text-muted mb-0">
                    Loading your apps…
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container py-5">
                <h1 className="fw-bold mb-3">
                    My Apps
                </h1>

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            </div>
        )
    }

    return (
        <main className="container py-4 py-md-5">
            <div className="aw-my-apps-panel">
                <div className="mb-4">
                    <h1 className="fw-bold mb-2">
                        My Apps
                    </h1>

                    <p className="aw-text-muted mb-0">
                        Choose which apps appear in your app
                        switcher, arrange them in the order you
                        prefer, and star the app you want to open
                        after signing in.
                    </p>
                </div>

                <div className="aw-my-apps-list">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={availableApps.map((app) => app.appKey)}
                            strategy={verticalListSortingStrategy}
                        >
                            {availableApps.map((app) => (
                                <SortableAppRow
                                    key={app.appKey}
                                    app={app}
                                    onEnabledChange={handleEnabledChange}
                                    onDefaultChange={handleDefaultChange}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
                <div
                    className="aw-my-apps-save-status"
                    aria-live="polite"
                >
                    {saveStatus === 'saving' && 'Saving…'}
                    {saveStatus === 'saved' && '✓ Saved'}
                    {saveStatus === 'error' && "Couldn't save changes"}
                </div>
                <div className="aw-my-apps-next">
                    <div>
                        <h2 className="h5 mb-1">
                            Where to next?
                        </h2>

                        <p className="aw-text-muted mb-0">
                            Continue to your default app when you're
                            finished making changes.
                        </p>
                    </div>

                    <div className="aw-my-apps-next-actions">
                        {validReturnTo && (
                            <button
                                type="button"
                                className="btn aw-btn-secondary"
                                onClick={handleBack}
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="me-2"
                                />
                                Back
                            </button>
                        )}

                        <button
                            type="button"
                            className="btn aw-btn-accent aw-my-apps-continue"
                            onClick={handleContinue}
                        >
                            Continue to {defaultApp?.name ?? 'AlanWilliams Apps'}
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="ms-2"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default MyAppsPage