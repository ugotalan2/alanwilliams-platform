import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import MyProfilePage from './pages/account/MyProfilePage'
import MyAppsPage from './pages/account/MyAppsPage'

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
            {
                path: '/contact',
                element: <ContactPage />,
            },
            {
                path: '/privacy',
                element: <PrivacyPolicyPage />,
            },
            {
                path: '/terms',
                element: <TermsOfServicePage />,
            },
            {
                path: '/account/profile',
                element: <MyProfilePage />,
            },
            {
                path: '/account/apps',
                element: <MyAppsPage />,
            },
        ],
    },
])