import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEnvelope,
    faPen,
    faShieldHalved,
    faUser,
    faClock,
} from '@fortawesome/free-solid-svg-icons'
import { useProfile } from './useProfile'
import { useClerk } from '@clerk/react'

const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Phoenix', label: 'Arizona Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'America/Anchorage', label: 'Alaska Time' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
    { value: 'UTC', label: 'UTC' },
]

function MyProfilePage() {
    const [editingField, setEditingField] = useState<'name' | 'email' | 'timeZone' | null>(null)
    const [nameValue, setNameValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [timeZoneValue, setTimeZoneValue] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const clerk = useClerk()

    const {
        profile,
        loading,
        error: profileError,
        updateProfile,
    } = useProfile()

    function beginNameEdit() {
        if (!profile) {
            return
        }

        setNameValue(profile.name)
        setEditingField('name')
        setError(null)
    }

    function cancelNameEdit() {
        if (profile) {
            setNameValue(profile.name)
        }

        setEditingField(null)
        setError(null)
    }

    async function saveName() {
        const trimmedName = nameValue.trim()

        if (!trimmedName) {
            setError('Name cannot be blank.')
            return
        }

        try {
            setSaving(true)
            setError(null)

            const updatedProfile = await updateProfile({
                name: trimmedName,
            })

            setNameValue(updatedProfile.name)
            setEditingField(null)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to update name'
            )
        } finally {
            setSaving(false)
        }
    }

    function beginEmailEdit() {
        if (!profile) {
            return
        }

        setEmailValue(profile.notificationEmail ?? '')
        setEditingField('email')
        setError(null)
    }

    function cancelEmailEdit() {
        if (profile) {
            setEmailValue(profile.notificationEmail ?? '')
        }

        setEditingField(null)
        setError(null)
    }

    async function saveEmail() {
        const trimmedEmail = emailValue.trim()

        if (!trimmedEmail) {
            setError('Email cannot be blank.')
            return
        }

        try {
            setSaving(true)
            setError(null)

            const updatedProfile = await updateProfile({
                notificationEmail: trimmedEmail,
            })

            setEmailValue(updatedProfile.notificationEmail ?? '')
            setEditingField(null)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to update email'
            )
        } finally {
            setSaving(false)
        }
    }

    function beginTimeZoneEdit() {
        if (!profile) {
            return
        }

        setTimeZoneValue(profile.timeZone ?? '')
        setEditingField('timeZone')
        setError(null)
    }

    function cancelTimeZoneEdit() {
        if (profile) {
            setTimeZoneValue(profile.timeZone ?? '')
        }

        setEditingField(null)
        setError(null)
    }

    async function saveTimeZone() {
        if (!timeZoneValue) {
            setError('Please select a time zone.')
            return
        }

        try {
            setSaving(true)
            setError(null)

            const updatedProfile = await updateProfile({
                timeZone: timeZoneValue,
            })

            setTimeZoneValue(updatedProfile.timeZone ?? '')
            setEditingField(null)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to update time zone'
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="container py-4 py-md-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8 col-xl-7">
                        <p className="aw-text-muted mb-0">
                            Loading profile...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container py-4 py-md-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8 col-xl-7">
                        <h1 className="h2 fw-bold mb-2">
                            My Profile
                        </h1>

                        <p className="text-danger mb-0">
                            {profileError ?? 'Unable to load your profile.'}
                        </p>
                    </div>
                </div>
            </div>
        )
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
                    </div>

                    {(profileError || error) && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            {profileError || error}
                        </div>
                    )}

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

                                    {editingField === 'name' ? (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={nameValue}
                                                maxLength={150}
                                                autoFocus
                                                disabled={saving}
                                                onChange={(event) =>
                                                    setNameValue(event.target.value)
                                                }
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        void saveName()
                                                    }

                                                    if (event.key === 'Escape') {
                                                        cancelNameEdit()
                                                    }
                                                }}
                                            />

                                            <div className="d-flex gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    className="btn aw-btn-secondary"
                                                    disabled={saving}
                                                    onClick={cancelNameEdit}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    disabled={saving}
                                                    onClick={() => void saveName()}
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="fw-semibold">
                                            {profile.name}
                                        </div>
                                    )}

                                    <div className="small aw-text-muted mt-1">
                                        This is your default name across AlanWilliams Apps.
                                        Individual apps or groups may let you choose a different
                                        display name in their settings.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`aw-profile-edit ${
                                    editingField !== null ? 'aw-profile-edit-hidden' : ''
                                }`}
                                aria-label="Edit name"
                                title="Edit name"
                                onClick={beginNameEdit}
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

                                    {editingField === 'email' ? (
                                        <div className="mt-2">
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={emailValue}
                                                maxLength={255}
                                                autoFocus
                                                disabled={saving}
                                                onChange={(event) =>
                                                    setEmailValue(event.target.value)
                                                }
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        void saveEmail()
                                                    }

                                                    if (event.key === 'Escape') {
                                                        cancelEmailEdit()
                                                    }
                                                }}
                                            />

                                            <div className="d-flex gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    className="btn aw-btn-secondary"
                                                    disabled={saving}
                                                    onClick={cancelEmailEdit}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    disabled={saving}
                                                    onClick={() => void saveEmail()}
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="fw-semibold">
                                            {profile.notificationEmail ?? 'Not set'}
                                        </div>
                                    )}

                                    <div className="small aw-text-muted mt-1">
                                        Notifications from AlanWilliams Apps are sent to this address.
                                        Changing it does not change how you sign in.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`aw-profile-edit ${
                                    editingField !== null ? 'aw-profile-edit-hidden' : ''
                                }`}
                                aria-label="Edit email"
                                title="Edit email"
                                onClick={beginEmailEdit}
                            >
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                        </div>

                        <hr />

                        <div className="aw-profile-row aw-profile-editable-row">
                            <div className="aw-profile-info">
                                <div className="aw-profile-icon">
                                    <FontAwesomeIcon icon={faClock} />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="small aw-text-muted">
                                        Time Zone
                                    </div>

                                    {editingField === 'timeZone' ? (
                                        <div className="mt-2">
                                            <select
                                                className="form-select"
                                                value={timeZoneValue}
                                                autoFocus
                                                disabled={saving}
                                                onChange={(event) =>
                                                    setTimeZoneValue(event.target.value)
                                                }
                                            >
                                                <option value="">
                                                    Select a time zone
                                                </option>

                                                {timeZones.map((timeZone) => (
                                                    <option
                                                        key={timeZone.value}
                                                        value={timeZone.value}
                                                    >
                                                        {timeZone.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="d-flex gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    className="btn aw-btn-secondary"
                                                    disabled={saving}
                                                    onClick={cancelTimeZoneEdit}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    disabled={saving}
                                                    onClick={() => void saveTimeZone()}
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="fw-semibold">
                                            {
                                                timeZones.find(
                                                    (timeZone) => timeZone.value === profile.timeZone
                                                )?.label ?? profile.timeZone ?? 'Not set'
                                            }
                                        </div>
                                    )}

                                    <div className="small aw-text-muted mt-1">
                                        Used for dates, times, reminders, and schedules across
                                        AlanWilliams Apps.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`aw-profile-edit ${
                                    editingField !== null ? 'aw-profile-edit-hidden' : ''
                                }`}
                                aria-label="Edit time zone"
                                title="Edit time zone"
                                onClick={beginTimeZoneEdit}
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
                                        Manage your sign-in methods, password, security settings, and active sessions.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn aw-btn-secondary aw-profile-action"
                                onClick={() => clerk.openUserProfile()}
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