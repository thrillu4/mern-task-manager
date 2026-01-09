import { useEffect, useState } from 'react'
import { API_PATH } from '../utils/apiPaths'
import axiosInstance from '../utils/axiosInstance'
import type { IUserData } from '../utils/types'
import { UserContext } from './context'

const UserProvider = ({ children }: React.PropsWithChildren) => {
	const [user, setUser] = useState<null | IUserData>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (user) return
		const accessToken = localStorage.getItem('token')
		if (!accessToken) {
			setLoading(false)
			return
		}
		const fetchUser = async () => {
			try {
				const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE)
				setUser(response.data.data)
			} catch (error) {
				console.log('User not authenticated', error)
				clearUser()
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	const updateUser = (userData: IUserData) => {
		setUser(userData)
		localStorage.setItem('token', userData.token)
		setLoading(false)
	}

	const clearUser = () => {
		setUser(null)
		localStorage.removeItem('token')
	}
	return (
		<UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
			{children}
		</UserContext.Provider>
	)
}

export default UserProvider
