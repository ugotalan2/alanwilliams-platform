import agendaIcon from '../styles/icons/agenda-icon.png'
import budgetIcon from '../styles/icons/budget-icon.png'
import choreIcon from '../styles/icons/chore-icon.png'
import fitnessIcon from '../styles/icons/fitness-icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHouse,
    faCalendarDays,
    faListCheck,
    faEllipsis,
    faGear,
    faFolderOpen,
    faUsers,
} from '@fortawesome/free-solid-svg-icons'

interface ThemePreviewCardProps {
    name: string
    icon: string
    themeClass: string
}

function ThemePreviewCard({
      name,
      icon,
      themeClass,
  }: ThemePreviewCardProps) {
    return (
        <div className={`aw-theme-preview ${themeClass}`}>
            <header className="aw-theme-preview-header">
                <div className="d-flex align-items-center gap-2">
          <span className="aw-logo-container aw-theme-preview-logo-container">
            <img
                src={icon}
                alt=""
                className="aw-theme-preview-logo"
            />
          </span>

                    <span className="fw-bold">
            {name}
          </span>
                </div>

                <nav className="aw-preview-top-nav">
                    <button type="button" className="aw-preview-top-nav-item">
                        Home
                    </button>

                    <button
                        type="button"
                        className="aw-preview-top-nav-item active"
                    >
                        Activity
                    </button>

                    <button type="button" className="aw-preview-top-nav-item">
                        Settings
                    </button>
                </nav>
            </header>

            <div className="aw-theme-preview-shell">
                <aside className="aw-preview-side-nav">
                    <button
                        type="button"
                        className="aw-preview-side-nav-item active"
                    >
                        <FontAwesomeIcon icon={faHouse} />
                        <span>Home</span>
                    </button>

                    <button
                        type="button"
                        className="aw-preview-side-nav-item"
                    >
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <span>Activity</span>
                    </button>

                    <button
                        type="button"
                        className="aw-preview-side-nav-item"
                    >
                        <FontAwesomeIcon icon={faFolderOpen} />
                        <span>Resources</span>
                    </button>

                    <button
                        type="button"
                        className="aw-preview-side-nav-item"
                    >
                        <FontAwesomeIcon icon={faUsers} />
                        <span>People</span>
                    </button>

                    <button
                        type="button"
                        className="aw-preview-side-nav-item"
                    >
                        <FontAwesomeIcon icon={faGear} />
                        <span>Settings</span>
                    </button>
                </aside>

                <main className="aw-theme-preview-content">
                    <h3 className="h4 fw-bold">
                        Sample {name} page
                    </h3>

                    <p className="aw-text-muted">
                        This preview shows how the application shell,
                        typography, controls, links, tags, and navigation
                        work together at different screen sizes.
                    </p>

                    <div className="aw-card p-4 mb-4">
                        <h4 className="h5 fw-bold">
                            Example content
                        </h4>

                        <p>
                            This is regular body text inside an application
                            card. Most of the interface remains neutral so
                            app identity comes from the logo, navigation,
                            and primary actions.
                        </p>

                        <p className="aw-text-muted">
                            Secondary information uses the shared muted
                            text treatment.
                        </p>

                        <div className="d-flex flex-wrap gap-2 mb-4">
                            <button
                                type="button"
                                className="btn aw-preview-btn-primary"
                            >
                                Primary Action
                            </button>

                            <button
                                type="button"
                                className="btn aw-btn-secondary"
                            >
                                Secondary Action
                            </button>
                        </div>

                        <div className="d-flex flex-wrap gap-3 align-items-center">
                            <a
                                href="#"
                                className="aw-preview-link"
                                onClick={(event) => event.preventDefault()}
                            >
                                Example link
                            </a>

                            <span className="aw-preview-tag">
                Example Tag
              </span>
                        </div>
                    </div>

                    <div className="aw-card p-4">
                        <h4 className="h5 fw-bold">
                            Additional content
                        </h4>

                        <p className="aw-text-muted mb-0">
                            This second card gives the preview enough height
                            to demonstrate how navigation behaves while the
                            application content scrolls.
                        </p>
                    </div>
                </main>
            </div>

            <nav className="aw-preview-bottom-nav">
                <button
                    type="button"
                    className="aw-preview-bottom-nav-item active"
                >
                    <FontAwesomeIcon icon={faHouse} />
                    <span>Home</span>
                </button>

                <button
                    type="button"
                    className="aw-preview-bottom-nav-item"
                >
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>Activity</span>
                </button>

                <button
                    type="button"
                    className="aw-preview-bottom-nav-item"
                >
                    <FontAwesomeIcon icon={faListCheck} />
                    <span>Tasks</span>
                </button>

                <button
                    type="button"
                    className="aw-preview-bottom-nav-item"
                >
                    <FontAwesomeIcon icon={faEllipsis} />
                    <span>More</span>
                </button>
            </nav>
        </div>
    )
}

function AppsPage() {
    return (
        <div className="container py-5">
            <div className="mb-4">
                <h1 className="fw-bold">Apps</h1>

                <p className="aw-text-muted">
                    Focused tools that share one account and a consistent experience.
                </p>
            </div>

            <div className="row g-3">
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="aw-card p-4 h-100">
                        <div className="aw-app-icon mb-3">
                            <span className="aw-logo-container aw-theme-preview-logo-container">
                                <img src={agendaIcon} alt="" className="aw-app-logo" />
                            </span>
                        </div>

                        <h2 className="h4">Agenda</h2>

                        <p className="aw-text-muted mb-0">
                            Meeting planning, discussion, assignments, follow-up, and shared
                            meeting resources.
                        </p>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="aw-card p-4 h-100">
                        <div className="aw-app-icon mb-3">
                            <span className="aw-logo-container aw-theme-preview-logo-container">
                                <img src={budgetIcon} alt="" className="aw-app-logo" />
                            </span>
                        </div>

                        <h2 className="h4">Budget</h2>

                        <p className="aw-text-muted mb-0">
                            Personal and household budgeting.
                        </p>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="aw-card p-4 h-100">
                        <div className="aw-app-icon mb-3">
                            <span className="aw-logo-container aw-theme-preview-logo-container">
                                <img src={choreIcon} alt="" className="aw-app-logo" />
                            </span>
                        </div>

                        <h2 className="h4">Chores</h2>

                        <p className="aw-text-muted mb-0">
                            Household responsibilities, recurring tasks, and shared work.
                        </p>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="aw-card p-4 h-100">
                        <div className="aw-app-icon mb-3">
                            <span className="aw-logo-container aw-theme-preview-logo-container">
                                <img src={fitnessIcon} alt="" className="aw-app-logo" />
                            </span>
                        </div>

                        <h2 className="h4">Fitness</h2>

                        <p className="aw-text-muted mb-0">
                            Workouts, progress tracking, and personal fitness goals.
                        </p>
                    </div>
                </div>
            </div>

            <section className="mt-5 pt-5 border-top">
                <div className="mb-4">
                    <h2 className="fw-bold">Theme Preview</h2>

                    <p className="aw-text-muted mb-0">
                        Temporary component preview for comparing app themes.
                    </p>
                </div>

                <div className="row g-4">
                    <div className="col-12">
                        <ThemePreviewCard
                            name="Agenda"
                            icon={agendaIcon}
                            themeClass="aw-theme-agenda"
                        />
                    </div>

                    <div className="col-12">
                        <ThemePreviewCard
                            name="Budget"
                            icon={budgetIcon}
                            themeClass="aw-theme-budget"
                        />
                    </div>

                    <div className="col-12">
                        <ThemePreviewCard
                            name="Chores"
                            icon={choreIcon}
                            themeClass="aw-theme-chores"
                        />
                    </div>

                    <div className="col-12">
                        <ThemePreviewCard
                            name="Fitness"
                            icon={fitnessIcon}
                            themeClass="aw-theme-fitness"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AppsPage