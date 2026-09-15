import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@ugotalan2/ui/styles.css'
import './styles/platform.css'
import App from './App'
import { ThemeProvider } from '@ugotalan2/ui'
import ProfileProvider from './pages/account/ProfileProvider'
import OnboardingGate from "./pages/account/OnboardingGate.tsx";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPublishableKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <ThemeProvider>
                <ProfileProvider>
                    <OnboardingGate>
                        <App />
                    </OnboardingGate>
                </ProfileProvider>
            </ThemeProvider>
        </ClerkProvider>
    </React.StrictMode>,
)