import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, } from '@fortawesome/free-solid-svg-icons'
import alanWilliamsIcon from '../../styles/icons/alanwilliams-icon.png'
import alanWilliamsIconDark from '../../styles/icons/alanwilliams-icon-white.png'
import AccountMenu from '../account/AccountMenu'
import AppearanceMenu from "../account/AppearanceMenu.tsx";
import { useAuth, useClerk } from '@clerk/react'

function PublicHeader() {

    const { isLoaded, isSignedIn } = useAuth()
    const { openSignIn } = useClerk()

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
                    <div className="navbar-nav aw-mobile-nav-row ms-auto align-items-center">
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

                        {isLoaded && (
                            isSignedIn ? (
                                <AccountMenu />
                            ) : (
                                <>
                                    <AppearanceMenu />

                                    <button
                                        type="button"
                                        className="btn aw-btn-accent aw-mobile-sign-in ms-md-2"
                                        onClick={() => openSignIn()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faRightToBracket}
                                            className="me-2"
                                        />
                                        Sign In / Sign Up
                                    </button>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default PublicHeader