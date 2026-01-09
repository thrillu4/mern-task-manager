import { createContext } from 'react'
import type { IUserData } from '../utils/types'

interface Context {
	user: IUserData | null
	loading: boolean
	updateUser: (userData: IUserData) => void
	clearUser: () => void
}

export const UserContext = createContext<Context>({
	user: null,
	loading: true,
	updateUser: () => {},
	clearUser: () => {},
})
