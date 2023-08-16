import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL

export const getData = async (path) => {
	try {
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWQ1YmVhYWI3ZjE5MTQ1MGZjMWJkZDRiMzdkMWY5NiIsInN1YiI6IjY0ZDY2OThmYjZjMjY0MTE1NzUzMGE2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YzGTpM88ooJL87p8jF172Ep3d_BUKgDCjEMcOM_ixz8'
			}
		};
		
		const res = await axios.get(BASE_URL + path, options)
		
		return res
	} catch (e) {
		throw new Error('Something went wrong ' + e.message)
	}
}

export const postData = async (path, body) => {
	try {
		const res = await axios.post(BASE_URL + path, body)

		return res
	} catch (e) {
		throw new Error('Something went wrong ' + e.message)
	}
}

export const patchData = async (path, body) => {
	try {
		const res = await axios.patch(BASE_URL + path, body)

		return res
	} catch (e) {
		throw new Error('Something went wrong ' + e.message)
	}
}