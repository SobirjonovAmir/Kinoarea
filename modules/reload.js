import { bg_poster, in_cinema, categories_list, trailers_list } from "/main.js"
import { getData, API_KEY } from "/modules/http.js";

const show_button = document.querySelector(".show-button")
const iframe = document.querySelector("iframe")
const trailer_title = document.querySelector(".new-trailers__content .info__title")
const currentYear = new Date().getFullYear();

let active_genre = "all"
let show_all = false
let array_length = 0



show_button.onclick = () => {
	if (show_button.getAttribute("data-show") == "true") {
		show_button.textContent = "Все новинки"
		show_button.setAttribute("data-show", false)
		show_all = false
		let productsSectionRect = in_cinema.getBoundingClientRect();
		let scrollToY = window.scrollY + productsSectionRect.top + 500;

		window.scrollTo({
			top: scrollToY,
			behavior: "smooth"
		});
	} else {
		show_button.textContent = "Скрыть"
		show_button.setAttribute("data-show", true)
		show_all = true

		let productsSectionRect = in_cinema.getBoundingClientRect();
		console.log(productsSectionRect.bottom);
		let scrollToY = window.scrollY + productsSectionRect.bottom + 1400;
		window.scrollTo({
			top: scrollToY,
			behavior: "smooth"
		});
	}

	checkBool(active_genre)
}

getData(`/genre/movie/list?api_key=${API_KEY}&language=ru-RU`)
	.then(res => {
		const all = document.createElement("li")
		all.classList.add("categories__list-item", "active")
		all.textContent = "Все"
		all.setAttribute("data-genre", "all")
		categories_list.append(all)

		const genres = res.data.genres;

		genres.forEach(genre => {
			const { id, name } = genre;
			const li = document.createElement("li")

			li.classList.add("categories__list-item")
			li.setAttribute("data-genre", id)
			li.textContent = name

			categories_list.append(li)
			let all_genres = document.querySelectorAll(".categories__list-item")
			all_genres.forEach(li => {
				li.onclick = () => {
					let key = li.getAttribute("data-genre")
					active_genre = key
					checkBool(key)
					document.querySelectorAll(".categories__list-item").forEach(el => el.classList.remove("active"))
					li.classList.add("active")
				}
			})
		});

		getData(`/movie/now_playing?api_key=${API_KEY}&language=ru-RU&sort_by=${currentYear}`)
			.then(res => {
				array_length = res.data.results.length
				show_button.style.display = "block"
				reload(res.data.results.slice(0, 8), in_cinema)
				let first_trailer = true
				for (const item of res.data.results) {
					getData(`/movie/${item.id}/videos?api_key=${API_KEY}`)
						.then(trailer => {
							if (trailer.data.results.length !== 0) {
								const div = document.createElement('div');
								const thumbnailElement = document.createElement('div');
								const thumbnailImage = document.createElement('img');
								const titleElement = document.createElement('span');
								const banner_bg = document.createElement("div")
								const polygon = document.createElement("img")

								div.classList.add('wrapper__item')
								thumbnailElement.classList.add('item-thumbnail')
								titleElement.classList.add('item-title')
								banner_bg.classList.add("banner-bg")
								polygon.classList.add("polygon")

								polygon.src = "/public/polygon.svg"
								thumbnailImage.src = item.poster_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : `/public/default-poster.jpg`
								titleElement.textContent = item.title

								if (first_trailer) {
									first_trailer = false
									iframe.src = `https://www.youtube.com/embed/${trailer.data.results[0].key}`
									banner_bg.classList.add('active')
									trailer_title.textContent = item.title
								}
								div.onclick = () => {
									document.querySelectorAll(".banner-bg").forEach(el => el.classList.remove("active"))
									banner_bg.classList.add('active')
									iframe.src = `https://www.youtube.com/embed/${trailer.data.results[0].key}`
									trailer_title.textContent = item.title
								}

								div.append(thumbnailElement, titleElement, banner_bg);
								thumbnailElement.append(thumbnailImage, banner_bg, polygon);

								trailers_list.append(div);
							}
						})
				}
			})
	})




export function reload(arr, place) {
	place.innerHTML = ""
	for (const item of arr) {
		const div = document.createElement("div")
		const banner = document.createElement("div")
		const banner_bg = document.createElement("div")
		const about = document.createElement("div")
		const about_text = document.createElement("span")
		const rating = document.createElement("div")
		const rating_text = document.createElement("span")
		const title = document.createElement("span")
		const subtitle = document.createElement("span")

		div.classList.add("swiper-slide", "content-item")
		banner.classList.add("item-banner", "active")
		banner_bg.classList.add("item-banner__bg", "active")
		rating.classList.add("item-rating")
		about.classList.add("item-about")
		title.classList.add("item-title")
		subtitle.classList.add("item-subtitle")

		about_text.textContent = "Карточка фильма"
		rating_text.textContent = (+item.vote_average).toFixed(2)
		banner.style.backgroundImage = item.poster_path ? `url(https://image.tmdb.org/t/p/original${item.poster_path})` : `url(/public/default-poster.jpg)`
		title.textContent = item.title
		title.title = item.title
		getData(`/genre/movie/list?api_key=${API_KEY}&language=ru-RU`)
			.then(res => {
				let genres = res.data.genres;
				let finded = []
				item.genre_ids.forEach(genre_id => {
					const genre = genres.find(genre => genre.id === genre_id);
					if (genre) {
						finded.push(genre.name)
					} else {
						console.log(`${genre_id} не найден.`);
					}
				})
				subtitle.innerHTML = finded.join(", ")
				subtitle.title = finded.join(", ")
			})

		banner.onmouseenter = () => {
			bg_poster.style.opacity = "0"
			setTimeout(() => {
				bg_poster.style.backgroundImage = item.backdrop_path ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` : `url(/public/default-bg.png)`
				bg_poster.classList.add("change")
				bg_poster.style.opacity = ".7"
			}, 500);
		}
		banner.onmouseleave = () => {
			bg_poster.classList.remove("change")
			bg_poster.style.backgroundImage = `url(public/default-bg.png)`
		}

		about.onclick = () => {
			window.open("/pages/about-movie/?id=" + item.id, '_blank')
		}

		div.append(banner, title, subtitle)
		banner.append(rating, banner_bg)
		banner_bg.append(about)
		about.append(about_text)
		rating.append(rating_text)

		place.append(div)
	}
}




function checkBool(key) {
	if (array_length < 8) {
		show_button.style.display = "none"
	} else {
		show_button.style.display = "block"
	}
	if (key === "all") {
		if (show_all) {
			getData(`/movie/now_playing?api_key=${API_KEY}&language=ru-RU&sort_by=${currentYear}.`)
				.then(res => reload(res.data.results, in_cinema))
		} else {
			getData(`/movie/now_playing?api_key=${API_KEY}&language=ru-RU&sort_by=${currentYear}`)
				.then(res => reload(res.data.results.slice(0, 8), in_cinema))
		}
	} else {
		if (show_all) {
			getData(`/movie/now_playing?api_key=${API_KEY}&with_genres=${+key}&language=ru-RU&sort_by=${currentYear}`)
				.then(res => { reload(res.data.results, in_cinema) })
		} else {
			getData(`/movie/now_playing?api_key=${API_KEY}&with_genres=${+key}&language=ru-RU&sort_by=${currentYear}`)
				.then(res => { reload(res.data.results.slice(0, 8), in_cinema) })
		}
	}
}