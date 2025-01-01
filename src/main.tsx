import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import LoginForm from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/home',
        element: <Dashboard/>
    },
    {
        path: '/login',
        element: <LoginForm />,
    }
])



createRoot(document.getElementById('root')!).render(
 <App/>
)
