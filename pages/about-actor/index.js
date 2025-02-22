import { getData, API_KEY } from "/modules/http";
import { getAgeString, findRussianName } from "/modules/helper";
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const personID = url.searchParams.get("id");
const currentYear = new Date().getFullYear();
const page_title = document.querySelector("#page-title")
const swipe_btns = document.querySelectorAll(".swipe__buttons button")
const actor_information = document.querySelector(".actor-information")
const actor_biography = document.querySelector(".actor-biography")
const bg_poster = document.querySelector('.bg-poster');
const movie_banner = document.querySelector('.left__banner');
const movie_title = document.querySelector('.movie-title');
const movie_location = document.querySelector('#movie-name');
const movie_original_title = document.querySelector('.movie__original-title');
const birthday = document.querySelector('.information-list .birthday');
const birth_place = document.querySelector('.information-list .birth-place');
const homepage = document.querySelector('.information-list .homepage');
const known_for = document.querySelector('.information-list .known-for');
const movie_descripton = document.querySelector('.biography');
const add_to_favourite = document.querySelector('.add-to-favourite');
const favourite_count = document.querySelector('#favourite-count');
const backdrops_wrapper = document.querySelector('.backdrops-wrapper');

const anticipated_swiper = document.querySelector(".anticipated-movies__content .swiper")
const anticipated_swiper_container = document.querySelector(".anticipated-movies__content .swiper-wrapper")


getData(`/person/${personID}?api_key=${API_KEY}&language=ru-RU&append_to_response=tagged_images%2Cexternal_ids%2Cimages%2Ctagged_images%2Cawards`)
	.then(res => {
		let person = res.data
		console.log(person);
		page_title.textContent = findRussianName(person.also_known_as) ? findRussianName(person.also_known_as) : person.name
		bg_poster.style.backgroundImage = person.backdrop_path ? `url(https://image.tmdb.org/t/p/original${person.backdrop_path})` : `url(/public/default-bg.png)`
		movie_banner.style.backgroundImage = person.profile_path ? `url(https://image.tmdb.org/t/p/original${person.profile_path})` : `url(/public/default-poster.jpg)`
		movie_title.textContent = findRussianName(person.also_known_as) ? findRussianName(person.also_known_as) : person.name
		movie_location.textContent = findRussianName(person.also_known_as) ? findRussianName(person.also_known_as) : person.name
		movie_original_title.textContent = person.name
		movie_descripton.innerHTML = person.biography ? person.biography : "Биография отсутствует"
		const formattedDate = format(parseISO(person.birthday), 'd MMMM yyyy', { locale: ru });
		birthday.innerHTML = `${formattedDate} (${getAgeString(currentYear - parseISO(person.birthday).getFullYear())}) `
		homepage.innerHTML = person.homepage ? `<a target="_blank" href='${person.homepage}'>${person.homepage}</a>` : "-"
		birth_place.innerHTML = person.place_of_birth
		known_for.innerHTML = person.known_for_department == "Acting" ? "Актёр" : person.known_for_department
		favourite_count.innerHTML = person.popularity.toFixed(0)
		let backdrops = person.images.profiles

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
			backdrops_wrapper.parentElement.firstElementChild.nextElementSibling.innerHTML = "Фотографииотсутствуют"
		}
	})

getData(`/person/${personID}/movie_credits?api_key=${API_KEY}&language=ru-RU`)
	.then(res => {
		const movies = res.data.cast
		const popularMovies = movies.filter(movie => movie.popularity > 20);

		reloadMovies(popularMovies, anticipated_swiper_container)

		new Swiper(anticipated_swiper, {
			modules: [Navigation, Pagination],
			slidesPerView: 4,
			slidesPerGroup: 4,
			spaceBetween: 20,
			grabCursor: true,

			navigation: {
				nextEl: ".anticipated-movies__content .swiper-button-next",
				prevEl: ".anticipated-movies__content .swiper-button-prev",
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
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







function reloadMovies(arr, place) {
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

		about.onclick = () => {
			window.open("/pages/about-movie/?id=" + item.id, '_blank')
		}


		banner_bg.append(about)
		about.append(about_text)
		rating.append(rating_text)
		banner.append(rating, banner_bg)
		div.append(banner, title, subtitle)

		place.append(div)
	}
}



swipe_btns.forEach(el => {
	el.onclick = () => {
		swipe_btns.forEach(btn => btn.classList.remove("active"))
		el.classList.add("active")
		let key = el.getAttribute("data-activity")
		if (key === "information") {
			actor_biography.classList.remove("active")
			actor_information.classList.add("active")
		} else {
			actor_information.classList.remove("active")
			actor_biography.classList.add("active")
		}

	}
})



let data = JSON.parse(localStorage.getItem("actors"))
if (JSON.parse(localStorage.getItem("actors"))) {
	if (data.includes(personID)) {
		add_to_favourite.classList.add("active")
		favourite_count.innerHTML++
	} else {
		add_to_favourite.classList.remove("active")
	}
}

add_to_favourite.onclick = () => {
	if (JSON.parse(localStorage.getItem("actors"))) {
		let data = JSON.parse(localStorage.getItem("actors"))
		if (data.includes(personID)) {
			let filtered = data.filter(item => item !== personID)
			localStorage.setItem("actors", JSON.stringify(filtered))
			add_to_favourite.classList.remove("active")
			favourite_count.innerHTML--
		} else {
			add_to_favourite.classList.add("active")
			favourite_count.innerHTML++
			localStorage.setItem("actors", JSON.stringify([...data, personID]))
		}
	} else {
		localStorage.setItem("actors", JSON.stringify([personID]))
		add_to_favourite.classList.add("active")
		favourite_count.innerHTML++
	}
}