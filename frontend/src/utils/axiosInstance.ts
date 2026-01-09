import axios from 'axios'
import { BASE_URL } from './apiPaths'

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('token')
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

axiosInstance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		let message = 'Something went wrong'

		if (error.response) {
			const status = error.response.status
			const serverMessage = error.response.data?.message

			if (status === 401) {
				message = 'Invalid email or password'
			} else if (status === 403) {
				message = 'You do not have permission to perform this action.'
			} else if (status === 404) {
				message = 'Requested resource not found.'
			} else if (status >= 500) {
				message = 'Server error. Please try again later.'
			} else {
				message = serverMessage || 'Request failed'
			}
		} else if (error.code === 'ECONNABORTED') {
			message = 'Request timeout. Please try again.'
		} else if (error.message === 'Network Error') {
			message = 'Network error. Check your internet connection.'
		}

		error.message = message

		return Promise.reject(error)
	}
)

export default axiosInstance
