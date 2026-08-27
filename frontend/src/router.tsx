import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import HomePage from './pages/HomePage'
import AppsPage from './pages/AppsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import MyProfilePage from './pages/account/MyProfilePage'

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/apps',
                element: <AppsPage />,
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
                path: '/account/profile',
                element: <MyProfilePage />,
            },
        ],
    },
])