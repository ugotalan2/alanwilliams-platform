// frontend/src/pages/PrivacyPolicyPage.tsx

function PrivacyPolicyPage() {
    return (
        <main className="container py-5">
            <div className="mx-auto" style={{ maxWidth: "800px" }}>
                <h1 className="mb-4">Privacy Policy</h1>

                <p className="text-body-secondary">
                    Last updated: August 31, 2026
                </p>

                <p>
                    AlanWilliams Apps provides personal and organizational applications,
                    including tools such as Agenda and other applications available through
                    the AlanWilliams Apps platform.
                </p>

                <h2 className="h4 mt-4">Information We Collect</h2>

                <p>
                    When you create or use an AlanWilliams Apps account, we may store
                    information such as your name, email address, preferred time zone,
                    appearance preferences, and information necessary to provide the
                    applications and services you use.
                </p>

                <h2 className="h4 mt-4">Authentication</h2>

                <p>
                    AlanWilliams Apps uses Clerk to provide authentication and account
                    security. Clerk may process information necessary to sign you in,
                    manage authentication methods, maintain sessions, and protect your
                    account.
                </p>

                <h2 className="h4 mt-4">Google Sign-In</h2>

                <p>
                    If you choose to sign in with Google, AlanWilliams Apps uses Google
                    only to authenticate your identity through Clerk. We may receive basic
                    account information such as your name, email address, and profile
                    information made available through the Google sign-in process.
                </p>

                <p>
                    AlanWilliams Apps does not use Google Sign-In to access your Gmail,
                    Google Drive, Google Calendar, contacts, or other Google content unless
                    a future feature separately requests and clearly explains that access.
                </p>

                <p>
                    Information received through Google Sign-In is used only to establish
                    and maintain your AlanWilliams Apps account and provide the services
                    you choose to use.
                </p>

                <h2 className="h4 mt-4">How We Use Information</h2>

                <p>We use account and application information to:</p>

                <ul>
                    <li>authenticate and identify users;</li>
                    <li>provide and operate AlanWilliams Apps;</li>
                    <li>maintain user preferences and application memberships;</li>
                    <li>protect accounts and application data; and</li>
                    <li>support application functionality requested by users.</li>
                </ul>

                <h2 className="h4 mt-4">Sharing of Information</h2>

                <p>
                    We do not sell personal information. Information may be processed by
                    service providers that are necessary to operate AlanWilliams Apps,
                    including authentication and infrastructure providers.
                </p>

                <h2 className="h4 mt-4">Data Storage and Retention</h2>

                <p>
                    Account and application data may be stored for as long as necessary to
                    provide the services you use, maintain application relationships and
                    history, satisfy legitimate operational requirements, and protect the
                    integrity of the platform.
                </p>

                <h2 className="h4 mt-4">Account and Data Requests</h2>

                <p>
                    You may contact us to request information about your account or to ask
                    about correction or deletion of personal information where applicable.
                </p>

                <h2 className="h4 mt-4">Changes to This Policy</h2>

                <p>
                    This Privacy Policy may be updated as AlanWilliams Apps evolves.
                    Material changes will be reflected by updating the date shown above.
                </p>

                <h2 className="h4 mt-4">Contact</h2>

                <p>
                    <p>
                        Questions about this Privacy Policy or requests concerning your
                        personal information may be sent to{" "}
                        <a href="mailto:ugotalan@gmail.com">
                            ugotalan@gmail.com
                        </a>.
                    </p>
                </p>
            </div>
        </main>
    );
}

export default PrivacyPolicyPage