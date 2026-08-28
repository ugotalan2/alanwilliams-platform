import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEnvelope,
    faShieldHalved,
    faUser,
    faPen,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "@clerk/react";

function MyProfilePage() {

    const { getToken } = useAuth();

    async function testBackendAuth() {
        const token = await getToken();

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Status:", response.status);
        console.log("Response:", await response.text());
    }

    const profile = {
        name: 'Alan Williams',
        email: 'alan@example.com',
        clerkUserId: 'user_placeholder',
    }

    return (
        <div className="container py-4 py-md-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8 col-xl-7">
                    <div className="mb-4">
                        <h1 className="h2 fw-bold mb-2">
                            My Profile
                        </h1>

                        <p className="aw-text-muted mb-0">
                            Your shared AlanWilliams Apps account information.
                        </p>


                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={testBackendAuth}
                        >
                            Test Backend Auth
                        </button>


                    </div>

                    <div className="aw-card p-3 p-md-4">
                        <div className="aw-profile-row aw-profile-editable-row">
                            <div className="aw-profile-info">
                                <div className="aw-profile-icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="small aw-text-muted">
                                        Name
                                    </div>

                                    <div className="fw-semibold">
                                        {profile.name}
                                    </div>

                                    <div className="small aw-text-muted mt-1">
                                        This is your default name across AlanWilliams Apps.
                                        Individual apps or groups may let you choose a different
                                        display name in their settings.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="aw-profile-edit"
                                aria-label="Edit name"
                                title="Edit name"
                            >
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                        </div>

                        <hr />

                        <div className="aw-profile-row aw-profile-editable-row">
                            <div className="aw-profile-info">
                                <div className="aw-profile-icon">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="small aw-text-muted">
                                        Email
                                    </div>

                                    <div className="fw-semibold">
                                        {profile.email}
                                    </div>

                                    <div className="small aw-text-muted mt-1">
                                        Notifications from AlanWilliams Apps are sent to this address.
                                        Changing it does not change how you sign in.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="aw-profile-edit"
                                aria-label="Edit email"
                                title="Edit email"
                            >
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                        </div>

                        <hr />

                        <div className="aw-profile-row">
                            <div className="aw-profile-info">
                                <div className="aw-profile-icon">
                                    <FontAwesomeIcon icon={faShieldHalved} />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="fw-semibold">
                                        Account Security
                                    </div>

                                    <div className="small aw-text-muted mt-1">
                                        Manage sign-in methods, password, passkeys,
                                        multi-factor authentication, and active sessions.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn aw-btn-secondary aw-profile-action"
                            >
                                Manage Security
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfilePage