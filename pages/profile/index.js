import { getData, API_KEY } from "/modules/http.js";

const user_auth = JSON.parse(localStorage.getItem('user_auth')) || null
const user_data = JSON.parse(localStorage.getItem('user_data')) || null
const user_foto = document.querySelector(".user-avatar img")
const user_name = document.querySelector(".user-name")
const aside_elements = document.querySelectorAll("aside ul li")
const pages = document.querySelectorAll(".pages")
const movies_wrapper = document.querySelector(".movies-wrapper")
const actors_wrapper = document.querySelector(".actors-wrapper")

let movies_data = JSON.parse(localStorage.getItem("movies")) || null
let actors_data = JSON.parse(localStorage.getItem("actors")) || null

if (actors_data) {
	actors_wrapper.innerHTML = ""
	for (const item of actors_data) {
		console.log(item);
		getData(`/person/${item}?api_key=${API_KEY}&language=ru-RU`)
			.then(res => {
				console.log(res.data);
				reloadCast(res.data, actors_wrapper)
			})
	}
} else {
	actors_wrapper.innerHTML = "Нету фильмов"
}



if (movies_data) {
	movies_wrapper.innerHTML = ""
	for (const item of movies_data) {
		getData(`/movie/${item}?api_key=${API_KEY}&language=ru-RU`)
			.then(res => {
				reload(res.data, movies_wrapper)
			})
	}
} else {
	movies_wrapper.innerHTML = "Нету фильмов"
}







aside_elements.forEach(el => {
	el.onclick = () => {
		aside_elements.forEach(el => el.classList.remove("active"))
		el.classList.add("active")
		pages.forEach(page => page.classList.remove("active"))
		pages.forEach(item => {
			let key = item.getAttribute("data-id")
			if (key === el.id) {
				item.classList.add("active")
			}
		})
	}
})






function reloadCast(person, place) {
	const div = document.createElement("div")
	const img_box = document.createElement("div")
	const title = document.createElement("div")
	const img = document.createElement("img")
	const name = document.createElement("span")
	const character = document.createElement("span")


	div.classList.add("starring__content-item")
	img_box.classList.add("item-image__box")
	title.classList.add("item-title__box")

	img_box.onclick = () => {
		window.open("/pages/about-actor/?id=" + person.id, '_blank')
	}
	name.onclick = () => {
		window.open("/pages/about-actor/?id=" + person.id, '_blank')
	}

	name.textContent = person.name
	character.textContent = person.character
	img.src = person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : "/default_profile.svg"

	div.append(img_box, title)
	img_box.append(img)
	title.append(name, character)

	place.append(div)
}





function reload(item, place) {
	const div = document.createElement("div")
	const img_box = document.createElement("div")
	const img = document.createElement("img")
	const title_box = document.createElement("div")
	const all_genres = document.createElement("span")
	const title = document.createElement("h3")
	const orig_title = document.createElement("h4")
	const rating = document.createElement("span")

	div.classList.add("wrapper-item")
	img_box.classList.add("img-box")
	rating.classList.add("rating")
	all_genres.classList.add("genres")

	getData(`/genre/movie/list?api_key=${API_KEY}&language=ru-RU`)
		.then(res => {
			let genres = res.data.genres;
			let finded = []
			if (item.genre_ids) {
				item.genre_ids.forEach(genre_id => {
					const genre = genres.find(genre => genre.id === genre_id);
					if (genre) {
						finded.push(genre.name)
					}
				})
				all_genres.innerHTML = finded.join(", ")
				all_genres.title = finded.join(", ")
			}
		})

	title.innerHTML = item.name ? item.name : item.title
	orig_title.innerHTML = item.original_name ? item.original_name : item.original_title
	rating.innerHTML = item.vote_average ? (+item.vote_average).toFixed(2) : (+item.popularity).toFixed(2)
	img.src = item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : `/public/default-poster.svg`

	div.onclick = () => {
		window.open("/pages/about-movie/?id=" + item.id, '_blank')
	}

	div.append(img_box, title_box, rating)
	img_box.append(img)
	title_box.append(title, orig_title, all_genres)

	place.append(div)
}













user_foto.src = `https://www.gravatar.com/avatar/${user_data.avatar.gravatar.hash}`
user_name.innerHTML = user_data.username

if (!user_auth) {
	location.assign("/")
}