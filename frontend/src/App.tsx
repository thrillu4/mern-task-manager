import { useContext } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import { ROUTES } from './constants/routes'
import { UserContext } from './context/context'
import UserProvider from './context/userContext'
import Dashboard from './pages/Admin/Dashboard'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import UserDashboard from './pages/User/UserDashboard'
import PrivateRoute from './routes/PrivateRoute'

function App() {
	return (
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/sign-in' element={<SignIn />} />
					<Route path='/sign-up' element={<SignUp />} />

					{/* admin routes */}
					<Route element={<PrivateRoute allowedRoles={['admin']} />}>
						<Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
					</Route>

					{/* member routes */}
					<Route element={<PrivateRoute allowedRoles={['admin']} />}>
						<Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
					</Route>

					{/* default route */}
					<Route path='/' element={<Root />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	)
}

export default App

const Root = () => {
	const { user, loading } = useContext(UserContext)

	if (loading) return <Outlet />

	if (!user) {
		return <Navigate to={ROUTES.SIGN_IN} />
	}

	return user.role === 'admin' ? (
		<Navigate to={ROUTES.ADMIN_DASHBOARD} />
	) : (
		<Navigate to={ROUTES.USER_DASHBOARD} />
	)
}
