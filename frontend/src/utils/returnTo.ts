const DEFAULT_RETURN_TO = '/'

export function buildReturnTo(pathname: string, search = '') {
    return `${pathname}${search}`
}

export function withReturnTo(
    destination: string,
    returnTo: string,
) {
    const params = new URLSearchParams()
    params.set('returnTo', returnTo)

    return `${destination}?${params.toString()}`
}

export function getReturnTo(
    searchParams: URLSearchParams,
) {
    const returnTo = searchParams.get('returnTo')

    if (!returnTo) {
        return DEFAULT_RETURN_TO
    }

    /*
     * Local-only rule for now.
     *
     * Once cross-subdomain navigation is implemented,
     * this validation moves into the shared allowed-origin
     * contract.
     */
    if (!returnTo.startsWith('/')) {
        return DEFAULT_RETURN_TO
    }

    return returnTo
}