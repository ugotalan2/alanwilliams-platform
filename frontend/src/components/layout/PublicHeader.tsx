import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faMoon, faSun, faDesktop, } from '@fortawesome/free-solid-svg-icons'
import alanWilliamsIcon from '../../styles/icons/alanwilliams-icon.png'
import alanWilliamsIconDark from '../../styles/icons/alanwilliams-dark-icon.png'
import { useTheme } from "../../theme/useTheme.ts";

function PublicHeader() {
    const {
        preference,
        setPreference,
    } = useTheme()

    return (
        <nav className="navbar navbar-expand-md aw-navbar sticky-top">
            <div className="container">
                <NavLink
                    to="/"
                    className="navbar-brand d-flex align-items-center gap-2"
                >
                    <span className="aw-brand-logo-container">
                      <img
                          src={alanWilliamsIcon}
                          alt=""
                          className="aw-brand-logo aw-brand-logo-light"
                      />

                      <img
                          src={alanWilliamsIconDark}
                          alt=""
                          className="aw-brand-logo aw-brand-logo-dark"
                      />
                    </span>
                    <span className="fw-semibold">AlanWilliams Apps</span>
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#publicNavbar"
                    aria-controls="publicNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="publicNavbar">
                    <div className="navbar-nav ms-auto align-items-md-center gap-md-1">
                        <NavLink
                            to="/apps"
                            data-label="Apps"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Apps
                        </NavLink>

                        <NavLink
                            to="/about"
                            data-label="About"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            About
                        </NavLink>

                        <NavLink
                            to="/contact"
                            data-label="Contact"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Contact
                        </NavLink>

                        <div className="dropdown ms-md-2">
                            <button
                                className="btn aw-btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <FontAwesomeIcon
                                    icon={
                                        preference === 'light'
                                            ? faSun
                                            : preference === 'dark'
                                                ? faMoon
                                                : faDesktop
                                    }
                                />
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => setPreference('system')}
                                    >
                                        <FontAwesomeIcon
                                            icon={faDesktop}
                                            className="me-2"
                                        />
                                        System
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => setPreference('light')}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSun}
                                            className="me-2"
                                        />
                                        Light
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => setPreference('dark')}
                                    >
                                        <FontAwesomeIcon
                                            icon={faMoon}
                                            className="me-2"
                                        />
                                        Dark
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            className="btn aw-btn-accent ms-md-2 mt-2 mt-md-0"
                            onClick={() => {
                                // Clerk sign-in will replace this.
                                console.log('Sign in')
                            }}
                        >
                            <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default PublicHeader