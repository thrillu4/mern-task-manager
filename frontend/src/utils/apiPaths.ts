export const BASE_URL = 'http://localhost:3001'

export const API_PATH = {
	AUTH: {
		REGISTER: '/api/v1/auth/register',
		LOGIN: '/api/v1/auth/login',
		GET_PROFILE: '/api/v1/auth/profile',
	},
	USERS: {
		GET_ALL_USERS: '/api/v1/users',
		GET_USER_BY_ID: (userId: string) => `/api/v1/users/${userId}`,
		CREATE_USER: `/api/v1/users`,
		UPDATE_USER: (userId: string) => `/api/v1/users/${userId}`,
		DELETE_USER: (userId: string) => `/api/v1/users/${userId}`,
	},
	TASKS: {
		GET_DASHBOARD_DATA: '/api/v1/tasks/dashboard-data',
		GET_USER_DASHBOARD_DATA: '/api/v1/tasks/user-dashboard-data',
		GET_ALL_TASKS: '/api/v1/tasks',
		GET_TASK_BY_ID: (taskId: string) => `/api/v1/tasks/${taskId}`,
		CREATE_TASK: '/api/v1/tasks',
		UPDATE_TASK: (taskId: string) => `/api/v1/tasks/${taskId}`,
		DELETE_TASK: (taskId: string) => `/api/v1/tasks/${taskId}`,
		UPDATE_TASK_STATUS: (taskId: string) => `/api/v1/tasks/${taskId}/status`,
		UPDATE_TODO_CHECKLIST: (taskId: string) => `/api/v1/tasks/${taskId}/todo`,
	},
	IMAGE: {
		UPLOAD_IMAGE: '/api/v1/auth/upload-image',
	},
}
