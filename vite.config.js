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
				main: resolve(__dirname, 'index.html'),
				profile: resolve(__dirname, 'pages/profile/index.html'),
				"about-movie": resolve(__dirname, 'pages/about-actor/index.html'),
				"about-actor": resolve(__dirname, 'pages/about-movie/index.html'),
			},
		},
	},
})