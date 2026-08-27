import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowRightFromBracket,
    faCircleUser,
    faGrip,
    faUser,
    faCheck,
    faChevronRight,
    faDesktop,
    faMoon,
    faSun,
} from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    buildReturnTo,
    withReturnTo,
} from '../../utils/returnTo'
import { useTheme} from "../../theme/useTheme.ts";
import { useEffect, useRef, useState } from "react";

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface AppearanceOptionProps {
    label: string
    icon: IconDefinition
    selected: boolean
    onSelect: () => void
}

function AppearanceOption({
                              label,
                              icon,
                              selected,
                              onSelect,
                          }: AppearanceOptionProps) {
    return (
        <button
            type="button"
            className={`dropdown-item aw-account-submenu-item ${
                selected ? 'active' : ''
            }`}
            onClick={(event) => {
                event.stopPropagation()
                onSelect()
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                className="me-2"
            />

            <span>{label}</span>

            {selected && (
                <FontAwesomeIcon
                    icon={faCheck}
                    className="ms-auto"
                />
            )}
        </button>
    )
}

function AccountMenu() {
    const location = useLocation()
    const navigate = useNavigate()

    const returnTo = buildReturnTo(
        location.pathname,
        location.search,
    )

    const navigateToAccount = (path: string) => {
        navigate(withReturnTo(path, returnTo))
    }

    const [appearanceOpen, setAppearanceOpen] = useState(false)

    const dropdownToggleRef = useRef<HTMLButtonElement>(null)

    const {
        preference,
        setPreference,
    } = useTheme()

    const appearanceIcon =
        preference === 'system'
            ? faDesktop
            : preference === 'light'
                ? faSun
                : faMoon

    const appearanceLabel =
        preference === 'system'
            ? 'System'
            : preference === 'light'
                ? 'Light'
                : 'Dark'

    useEffect(() => {
        const toggleElement = dropdownToggleRef.current

        if (!toggleElement) {
            return
        }

        const handleDropdownHidden = () => {
            setAppearanceOpen(false)
        }

        toggleElement.addEventListener(
            'hidden.bs.dropdown',
            handleDropdownHidden,
        )

        return () => {
            toggleElement.removeEventListener(
                'hidden.bs.dropdown',
                handleDropdownHidden,
            )
        }
    }, [])

    return (
        <div className="dropdown">
            <button
                ref={dropdownToggleRef}
                type="button"
                className="aw-account-menu-trigger dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Open profile menu"
            >
                <FontAwesomeIcon icon={faCircleUser} />
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={() =>
                            navigateToAccount('/account/profile')
                        }
                    >
                        <FontAwesomeIcon
                            icon={faUser}
                            className="me-2"
                        />
                        My Profile
                    </button>
                </li>

                <li className="aw-account-submenu">
                    <button
                        type="button"
                        className="dropdown-item aw-account-submenu-trigger"
                        onClick={(event) => {
                                event.stopPropagation()
                                setAppearanceOpen((open) => !open)
                            }}
                            aria-expanded={appearanceOpen}
                        >
                        <span className="d-flex align-items-center">
                          <FontAwesomeIcon
                              icon={appearanceIcon}
                              className="me-2"
                          />

                            {appearanceLabel}
                        </span>
                          <FontAwesomeIcon
                              icon={faChevronRight}
                              className={
                                  appearanceOpen
                                      ? 'aw-submenu-chevron open'
                                      : 'aw-submenu-chevron'
                              }
                          />
                    </button>

                    {appearanceOpen && (
                        <div className="aw-account-submenu-items">
                            <AppearanceOption
                                label="System"
                                icon={faDesktop}
                                selected={preference === 'system'}
                                onSelect={() => {
                                    setPreference('system')
                                    setAppearanceOpen(false)
                                }}
                            />

                            <AppearanceOption
                                label="Light"
                                icon={faSun}
                                selected={preference === 'light'}
                                onSelect={() => {
                                    setPreference('light')
                                    setAppearanceOpen(false)
                                }}
                            />

                            <AppearanceOption
                                label="Dark"
                                icon={faMoon}
                                selected={preference === 'dark'}
                                onSelect={() => {
                                    setPreference('dark')
                                    setAppearanceOpen(false)
                                }}
                            />
                        </div>
                    )}
                </li>

                <li>
                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={() =>
                            navigateToAccount('/account/apps')
                        }
                    >
                        <FontAwesomeIcon
                            icon={faGrip}
                            className="me-2"
                        />
                        My Apps
                    </button>
                </li>

                <li>
                    <hr className="dropdown-divider" />
                </li>

                <li>
                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                            console.log('Sign out')
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowRightFromBracket}
                            className="me-2"
                        />
                        Sign Out
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default AccountMenu