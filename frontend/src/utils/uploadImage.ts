import { API_PATH } from './apiPaths'
import axiosInstance from './axiosInstance'

export const uploadImage = async (imageFile: File) => {
	const formData = new FormData()

	formData.append('image', imageFile)

	try {
		const response = await axiosInstance.post(
			API_PATH.IMAGE.UPLOAD_IMAGE,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return response.data.data
	} catch (error) {
		console.log('Error uploading the image', error)
		throw error
	}
}
