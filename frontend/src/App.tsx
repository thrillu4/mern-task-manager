import { BrowserRouter, Route, Routes } from 'react-router'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/sign-in' element={<SignIn />} />
				<Route path='/sign-up' element={<SignUp />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
