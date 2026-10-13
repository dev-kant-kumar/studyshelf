import { Routes, Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import Dashboard from './pages/Dashboard/Dashboard'
export default function AdminRoutes() { return <Routes><Route element={<AdminLayout />}><Route index element={<Dashboard />} /><Route path="*" element={<p>Page not found.</p>} /></Route></Routes> }
