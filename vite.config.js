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
				actor: resolve(__dirname, 'pages/about-actor/index.html'),
			},
		},
	},
})