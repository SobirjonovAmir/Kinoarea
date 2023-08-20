import { getData } from "/modules/http"
const form = document.forms.form

form.onsubmit = (e) => {
	e.preventDefault()

	let value = document.querySelector("input").value

	getData(`https://api.themoviedb.org/3/search/multi`)
	

	console.log(value);
	e.target.reset()
}