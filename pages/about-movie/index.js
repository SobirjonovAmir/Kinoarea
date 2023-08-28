import { getData, API_KEY } from "/modules/http";
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import Chart from 'chart.js/auto';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const movieId = url.searchParams.get("id");

const swiper_container = document.querySelector(".swiper")
const swiper_wrapper = document.querySelector(".swiper-wrapper")
const bg_poster = document.querySelector('.bg-poster');
const movie_banner = document.querySelector('.left__banner');
const movie_title = document.querySelectorAll('.movie-name');
const movie_original_title = document.querySelector('.movie__original-title');
const movie_descripton = document.querySelector('.movie-description');
const add_to_favourite = document.querySelector('.add-to-favourite');
const range_rating = document.querySelector('.range-rating .fill');
const range_rating_p = document.querySelector('.range-rating p');
const favourite_count = document.querySelector('#favourite-count');
const wrapper_list = document.querySelector('.wrapper__list');
const producer_section = document.querySelector('.producer');
const starring_content = document.querySelector('.starring__content');
const posters_wrapper = document.querySelector('.posters-wrapper');
const backdrops_wrapper = document.querySelector('.backdrops-wrapper');
const kinopoisk = document.querySelector('.kinopoisk .canvas-bg');
const imdb = document.querySelector('.imdb .canvas-bg');
const iframe = document.querySelector("iframe")


getData(`/movie/${movieId}?api_key=${API_KEY}&language=ru`)
	.then(res => {
		let item = res.data
		console.log(item.popularity);
		bg_poster.style.backgroundImage = item.backdrop_path ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` : `url(/public/default-bg.png)`
		movie_banner.style.backgroundImage = item.poster_path ? `url(https://image.tmdb.org/t/p/original${item.poster_path})` : `url(/public/default-poster.svg)`
		movie_title.forEach(title => title.textContent = item.title)
		movie_original_title.textContent = item.original_title
		movie_descripton.textContent = item.overview
		range_rating.style.width = `${(item.vote_average / 10) * 100}%`
		range_rating_p.innerHTML = `Рейтинг ожиданий ${Math.round((item.vote_average / 10) * 100)}%`
		favourite_count.textContent = Math.floor(item.popularity)

		let normalizedValue = (item.popularity - 1) / (item.popularity - 1);
		let scaledValue = normalizedValue * (10 - 1) + 1;
		let roundedValue = Math.round(scaledValue) - 4;

		kinopoisk.parentElement.lastElementChild.innerHTML = item.vote_average.toFixed(2)
		imdb.parentElement.lastElementChild.innerHTML = (roundedValue).toFixed(2)

		kinopoisk.style.backgroundColor = getColorForRating(Math.floor(item.vote_average))
		imdb.style.backgroundColor = getColorForRating(roundedValue)

		createRatingChart(item.vote_average, 'kinopoisk', getChartColor(Math.floor(item.vote_average)));
		createRatingChart(roundedValue, 'imdb', getChartColor(roundedValue))

		getData(`/movie/${item.id}/videos?api_key=${API_KEY}`)
			.then(trailer => {
				if (trailer.data.results.length !== 0) {
					iframe.src = `https://www.youtube.com/embed/${trailer.data.results[0].key}`
				} else {
					let span = document.createElement("span")
					span.innerHTML = "Для данного фильма трейлеры отсутствуют"
					iframe.parentElement.parentElement.append(span)
					iframe.parentElement.remove()
				}
			})


		delete item.original_title
		delete item.title
		delete item.tagline
		delete item.popularity
		delete item.id
		delete item.imdb_id
		delete item.overview
		delete item.backdrop_path
		delete item.poster_path
		delete item.video
		for (const key in item) {
			const element = item[key];

			const li = document.createElement("li")
			const span = document.createElement("span")
			const value = document.createElement('span')
			li.classList.add("list__item")
			span.innerHTML = key.split("_",).join(" ") + ":"
			li.append(span, value)


			if (Array.isArray(element)) {
				const data = element
					.filter(item => item.name !== "")
					.map(el => el.name)
					.join(', ');
				value.innerHTML = data
				value.title = data
				wrapper_list.append(li)
			} else if (typeof element == "string" && element) {
				if (element.slice(0, 5) == "https") {
					value.innerHTML = `<a target="_blank" href="${element}">${element}</a>`
					value.title = element
				} else if (key === "release_date") {
					const releaseDate = parseISO(item.release_date);
					const formattedDate = format(releaseDate, 'd MMMM yyyy', { locale: ru });
					value.innerHTML = formattedDate
				} else {
					value.innerHTML = element
				}
				wrapper_list.append(li)
			} else if (typeof element === 'number') {
				if (key === "budget" || key === "revenue") {
					value.innerHTML = element.toLocaleString() + " $"
				} else {
					value.innerHTML = element.toLocaleString()
				}
				wrapper_list.append(li)
			} else if (typeof element === 'boolean') {
				if (element) {
					value.innerHTML = "Да"
				} else {
					value.innerHTML = "Нет"
				}
				wrapper_list.append(li)
			}
		}
	})

getData(`/movie/${movieId}/credits?api_key=${API_KEY}&language=ru-RU`)
	.then(res => {
		let cast = res.data.cast
		let crew = res.data.crew

		reloadCast(cast.slice(0, 10), starring_content)

		function filterByJob(job) {
			return crew.filter(member => member.known_for_department === job);
		}

		const directors = filterByJob('Directing');
		const editor = filterByJob('Editing');
		const production = filterByJob('Production');

		for (const person of directors.slice(0, 2)) {
			if (person) {
				const div = document.createElement("div")
				const img = document.createElement("img")
				const img_box = document.createElement("div")
				const title = document.createElement("div")
				const name = document.createElement("span")
				const job = document.createElement("span")

				div.classList.add("producer__item")

				img.src = person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : "/default_profile.svg"
				name.innerHTML = person.name
				job.innerHTML = person.job ? person.job : person.known_for_department

				div.append(img_box, title)
				img_box.append(img)
				title.append(name, job)
				producer_section.append(div)
			}
		}

		reloadCrew(editor, producer_section, "Редакторы")
		reloadCrew(production, producer_section, "Производство")

	})

getData(`/movie/${movieId}?api_key=${API_KEY}&append_to_response=images`)
	.then(res => {
		let posters = res.data.images.posters
		let backdrops = res.data.images.backdrops

		if (posters.length !== 0) {
			for (let i = 0; i < 4; i++) {
				const poster = posters[i];
				if (poster) {
					const div = document.createElement("div")
					if (i === 3) {
						const span = document.createElement("span")
						const bg = document.createElement("div")
						span.innerHTML = "+" + (posters.length - 4)
						div.append(span, bg)
					}
					div.style.backgroundImage = poster.file_path ? `url(https://image.tmdb.org/t/p/original${poster.file_path})` : `url(/public/default-poster.svg)`
					posters_wrapper.append(div)
				}
			}
		} else {
			posters_wrapper.parentElement.firstElementChild.nextElementSibling.innerHTML = "Для данного фильма постеры отсутствуют"
		}

		if (backdrops.length !== 0) {
			for (let i = 0; i < 6; i++) {
				const backdrop = backdrops[i];
				if (backdrop) {
					const div = document.createElement("div")
					if (i === 5) {
						const span = document.createElement("span")
						const bg = document.createElement("div")
						span.innerHTML = "+" + (backdrops.length - 6)
						div.append(span, bg)
					}
					div.style.backgroundImage = backdrop.file_path ? `url(https://image.tmdb.org/t/p/original${backdrop.file_path})` : `url(/public/default-poster.svg)`
					backdrops_wrapper.append(div)
				}
			}
		} else {
			backdrops_wrapper.parentElement.firstElementChild.nextElementSibling.innerHTML = "Для данного фильма кадры отсутствуют"
		}

	})

getData(`/movie/${movieId}/similar?api_key=${API_KEY}&language=ru-RU`)
	.then(res => {
		reload(res.data.results, swiper_wrapper)
		new Swiper(swiper_container, {
			modules: [Navigation, Pagination],
			slidesPerView: 4,
			slidesPerGroup: 4,
			spaceBetween: 20,
			direction: 'horizontal',
			grabCursor: true,
			touchRatio: 1,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			pagination: {
				el: ".swiper-pagination",
				type: "fraction",
			},
			breakpoints: {
				100: {
					spaceBetween: 5,
					slidesPerView: 1,
					slidesPerGroup: 1,
				},
				300: {
					spaceBetween: 10,
					slidesPerView: 2,
					slidesPerGroup: 2,
				},
				458: {
					slidesPerGroup: 2,
					slidesPerView: 2,
					spaceBetween: 15,
				},
				650: {
					slidesPerView: 3,
					slidesPerGroup: 3,
					spaceBetween: 15,
				},
				900: {
					slidesPerView: 4,
					slidesPerGroup: 4,
					spaceBetween: 20,
				}
			},
		});

	})


function getChartColor(rating) {
	let colors = ["#ff0000", "#f13030", "#da3434", "#cb3f36", "cb6c36", "#89cb36", "#78cb36", "#4bcb36", "#34ea16", "#28ff04"]
	if (rating >= 1 && rating <= 10) {
		return colors[rating - 1];
	} else {
		return 'rgba(25, 30, 46, 0.30)';
	}
}
function getColorForRating(rating) {
	let colors = ["rgba(255, 0, 0, 0.30)", "rgba(241, 48, 48, 0.30)", "rgba(218, 52, 52, 0.30)", "rgba(203, 63, 54, 0.30)", "rgba(203, 108, 54, 0.30)", "rgba(137, 203, 54, 0.30)", "rgba(120, 203, 54, 0.30)", "rgba(75, 203, 54, 0.30)", "rgba(52, 234, 22, 0.30)", "rgba(75, 203, 54, 0.30)"]

	if (rating >= 1 && rating <= 10) {
		return colors[rating - 1];
	} else {
		return 'rgba(25, 30, 46, 0.30)';
	}
}

function createRatingChart(rating, targetElementId, color) {
	const maxRating = 10
	const emptySpace = maxRating - rating
	const data = {
		datasets: [{
			data: [rating, emptySpace],
			backgroundColor: [color, "transparent"],
			borderWidth: 0,
			cutout: '68%'
		}]
	};

	const options = {
		responsive: true,
		legend: { display: false },
		plugins: {
			tooltip: {
				enabled: false
			},
			doughnutlabel: {
				labels: [{
					text: rating.toFixed(2),
					font: {
						size: '45'
					}
				}]
			}
		}
	};

	const ctx = document.getElementById(targetElementId).getContext('2d');
	const chart = new Chart(ctx, {
		type: 'doughnut',
		data: data,
		options: options
	});
}

function reload(arr, place) {
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

function reloadCast(arr, place) {
	place.innerHTML = ""
	for (const person of arr) {
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
}


function reloadCrew(arr, place, txt) {
	const div = document.createElement("div")
	const title = document.createElement("p")
	const ol = document.createElement("ol")
	title.innerHTML = txt
	for (let i = 0; i <= 2; i++) {
		let person = arr[i]
		if (person) {
			const li = document.createElement("li")
			li.innerHTML = person.name
			ol.append(li)
		}
	}

	div.append(title, ol)
	place.append(div)
}


let data = JSON.parse(localStorage.getItem("movies"))
if (data) {
	if (data.includes(movieId)) {
		add_to_favourite.classList.add("active")

	} else {
		add_to_favourite.classList.remove("active")
	}
}
if (add_to_favourite.classList.contains("active")) {
	favourite_count.innerHTML++
}

add_to_favourite.onclick = () => {
	let data = JSON.parse(localStorage.getItem("movies")) || null
	if (data) {
		if (data.includes(movieId)) {
			let filtered = data.filter(item => item !== movieId)
			localStorage.setItem("movies", JSON.stringify(filtered))
			add_to_favourite.classList.remove("active")
			favourite_count.innerHTML--
		} else {
			add_to_favourite.classList.add("active")
			localStorage.setItem("movies", JSON.stringify([...data, movieId]))
			favourite_count.innerHTML++
		}
	} else {
		localStorage.setItem("movies", JSON.stringify([movieId]))
		add_to_favourite.classList.add("active")
		favourite_count.innerHTML++
	}
}



