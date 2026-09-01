export type AppSubdomain =
    | 'platform'
    | 'agenda'
    | 'budget'
    | 'chores'
    | 'fitness'

const LOCAL_APP_PORTS: Partial<
    Record<AppSubdomain, number>
> = {
    platform: 5174,
    agenda: 5173,
    // Put the actual Agenda frontend host port here.
    // agenda: 5175,
}

export function buildAppUrl(
    subdomain: AppSubdomain,
): string {
    const { hostname, protocol } = window.location

    /*
     * Local development.
     *
     * Preserve localhost vs LAN IP so phone testing keeps
     * using the same machine instead of switching environments.
     */
    if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('172.')
    ) {
        const port = LOCAL_APP_PORTS[subdomain]

        if (!port) {
            throw new Error(
                `No local port configured for app: ${subdomain}`,
            )
        }

        return `${protocol}//${hostname}:${port}`
    }

    /*
     * Test environment.
     */
    if (
        hostname === 'test.alanwilliams.app' ||
        hostname.endsWith('-test.alanwilliams.app')
    ) {
        if (subdomain === 'platform') {
            return 'https://test.alanwilliams.app'
        }

        return `https://${subdomain}-test.alanwilliams.app`
    }

    /*
     * Production.
     */
    if (
        hostname === 'alanwilliams.app' ||
        hostname.endsWith('.alanwilliams.app')
    ) {
        if (subdomain === 'platform') {
            return 'https://alanwilliams.app'
        }

        return `https://${subdomain}.alanwilliams.app`
    }

    throw new Error(
        `Unable to determine app environment from host: ${hostname}`,
    )
}