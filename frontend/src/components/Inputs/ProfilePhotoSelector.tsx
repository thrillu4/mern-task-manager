import { Avatar, Box, Button, Typography } from '@mui/material'
import * as React from 'react'

type Props = {
	onChange: (file: File | null) => void
}

export function ProfilePhotoSelector({ onChange }: Props) {
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const [preview, setPreview] = React.useState<string | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) return
		if (file.size > 2 * 1024 * 1024) return // 2MB

		setPreview(URL.createObjectURL(file))
		onChange(file)
	}

	return (
		<Box textAlign='center'>
			<input
				ref={inputRef}
				type='file'
				name='avatar'
				accept='image/*'
				hidden
				onChange={handleFileChange}
			/>

			<Avatar
				src={preview ?? undefined}
				sx={{
					width: 96,
					height: 96,
					mx: 'auto',
					mb: 1,
					cursor: 'pointer',
				}}
				onClick={() => inputRef.current?.click()}
			/>

			<Button
				size='small'
				variant='outlined'
				onClick={() => inputRef.current?.click()}
			>
				Upload photo
			</Button>

			<Typography variant='caption' display='block' mt={1}>
				JPG / PNG • max 2MB
			</Typography>
		</Box>
	)
}
