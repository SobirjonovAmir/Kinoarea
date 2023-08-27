import {
	resolve
} from 'path'
import {
	defineConfig
} from 'vite'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				kinoarea: resolve(__dirname, 'index.html'),
				profile: resolve(__dirname, 'pages/profile/index.html'),
			},
		},
	},
})