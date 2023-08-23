import { bg_poster, in_cinema, categories_list, trailers_list } from "/main.js"
import { calculateAge, getAgeString, findRussianName } from "./helper";
import { getData, API_KEY } from "/modules/http.js";
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

let first_place = document.querySelector(".popular-persons__content .first-place")
let second_place = document.querySelector(".popular-persons__content .second-place")
let persons_others = document.querySelector(".popular-persons__content .others")
let popular_persons_nav = document.querySelectorAll(".popular-persons .categories__list li")
const show_button = document.querySelector(".show-button")
const iframe = document.querySelector("iframe")
const trailer_title = document.querySelector(".new-trailers__content .info__title")
const currentYear = new Date().getFullYear();


let active_genre = "all"
let show_all = false
let array_length = 0


if (show_button) {
	show_button.onclick = () => {
		let productsSectionRect = in_cinema.getBoundingClientRect();
		if (show_button.getAttribute("data-show") == "true") {
			show_button.setAttribute("data-show", false)
			show_all = false
			let scrollToY = window.scrollY + productsSectionRect.top + 500;
	
			setTimeout(() => {
				show_button.textContent = "Все новинки"
				window.scrollTo({
					top: scrollToY,
					behavior: "smooth"
				});
			}, 10);
	
		} else {
			show_button.setAttribute("data-show", true)
			show_all = true
			let scrollToY = window.scrollY + productsSectionRect.bottom + 1400;
	
			setTimeout(() => {
				show_button.textContent = "Скрыть"
				window.scrollTo({
					top: scrollToY,
					behavior: "smooth"
				});
			}, 200);
	
		}
	
		checkBool(active_genre)
	}
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
								thumbnailImage.src = item.poster_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : `/public/default-poster.svg`
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




export function reload(arr, place, bool) {
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
		banner.style.backgroundImage = item.poster_path ? `url(https://image.tmdb.org/t/p/original${item.poster_path})` : `url(/public/default-poster.svg)`
		title.textContent = item.title
		title.title = item.title


		if (bool) {
			const releaseDate = parseISO(item.release_date);
			const formattedDate = format(releaseDate, 'd MMMM yyyy', { locale: ru });

			subtitle.textContent = `${formattedDate} в России`
		} else {
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
		}

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
		if (bool) {
			banner.append(banner_bg)
		} else {
			banner.append(rating, banner_bg)
		}
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



popular_persons_nav.forEach(button => {
	popular_persons_nav[0].classList.add("active")
	button.onclick = () => {
		popular_persons_nav.forEach(el => el.classList.remove("active"))
		button.classList.add("active")
		let key = button.getAttribute("data-date")
		reloadPersons(key)
	}
})

reloadPersons("week")
function reloadPersons(key) {
	getData(`/trending/person/${key}?api_key=${API_KEY}&language=ru-RU`)
		.then(res => {
			let popular = res.data.results
			first_place.innerHTML = ""
			second_place.innerHTML = ""
			persons_others.innerHTML = ""
			for (let i = 0; i < popular.length; i++) {
				const person = popular[i];
				getData(`/person/${person.id}?api_key=${API_KEY}&language=ru-RU`)
					.then(res => {
						let element = res.data
						const div = document.createElement('div');
						const rankingPlace = document.createElement('span');
						const personName = document.createElement('h3');
						const originalName = document.createElement('h4');
						const personAge = document.createElement('span');

						rankingPlace.className = 'ranking-place';
						personName.className = 'person-name';
						originalName.className = 'original-name';
						personAge.className = 'person-age';

						rankingPlace.textContent = `${i + 1}-е место`
						personName.textContent = findRussianName(element.also_known_as) ? findRussianName(element.also_known_as) : element.name
						originalName.textContent = element.name;
						personAge.textContent = getAgeString(calculateAge(element.birthday))

						if (i === 0) {
							first_place.onclick = () => window.open("/pages/about-actor/?id=" + element.id, '_blank')
							first_place.append(rankingPlace, personName, originalName, personAge);
							first_place.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${element.profile_path})`
						} else if (i === 1) {
							second_place.onclick = () => window.open("/pages/about-actor/?id=" + element.id, '_blank')
							second_place.append(rankingPlace, personName, originalName, personAge);
							second_place.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${element.profile_path})`
						} else if (i === i) {
							div.onclick = () => window.open("/pages/about-actor/?id=" + element.id, '_blank')
							persons_others.append(div);
							div.append(rankingPlace, personName, originalName, personAge)
						}
					})
			}
		})
}

