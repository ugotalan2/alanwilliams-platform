const ALLOWED_APP_ORIGINS = new Set([
    // Local development
    'http://localhost:5173',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',

    // LAN development
    'http://10.0.0.31:5173',
    'http://10.0.0.31:5175',
    'http://10.0.0.31:5176',
    'http://10.0.0.31:5177',

    // Test
    'https://agenda-test.alanwilliams.app',
    'https://budget-test.alanwilliams.app',
    'https://chores-test.alanwilliams.app',
    'https://fitness-test.alanwilliams.app',

    // Production
    'https://agenda.alanwilliams.app',
    'https://budget.alanwilliams.app',
    'https://chores.alanwilliams.app',
    'https://fitness.alanwilliams.app',
])

export function getValidatedPlatformReturnTo(
    rawReturnTo: string | null,
): string | null {
    if (!rawReturnTo) {
        return null
    }

    try {
        const url = new URL(rawReturnTo)

        if (!ALLOWED_APP_ORIGINS.has(url.origin)) {
            return null
        }

        return url.toString()
    } catch {
        return null
    }
}