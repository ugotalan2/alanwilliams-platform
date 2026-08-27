import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDesktop, faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {useTheme} from "../../theme/useTheme.ts";

function AppearanceMenu() {

    const {
        preference,
        setPreference,
    } = useTheme()

    const themeIcon =
        preference === 'dark'
            ? faMoon
            : preference === 'light'
                ? faSun
                : faDesktop

    return (
        <div className="dropdown">
            <button
                type="button"
                className="aw-header-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label={`Appearance: ${preference}`}
                title={`Appearance: ${preference}`}
            >
                <FontAwesomeIcon icon={themeIcon} />
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <button
                        type="button"
                        className={`dropdown-item ${
                            preference === 'system' ? 'active' : ''
                        }`}
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
                        type="button"
                        className={`dropdown-item ${
                            preference === 'light' ? 'active' : ''
                        }`}
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
                        type="button"
                        className={`dropdown-item ${
                            preference === 'dark' ? 'active' : ''
                        }`}
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
    )
}

export default AppearanceMenu