import { getData, API_KEY } from "./http";
import { reload } from "./reload";

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper_container = document.querySelector(".swiper")
const swiper = document.querySelector(".swiper-wrapper")
const anticipated_swiper = document.querySelector(".anticipated-movies__content .swiper")
const anticipated_swiper_container = document.querySelector(".anticipated-movies__content .swiper-wrapper")
const popular_movies = document.querySelectorAll(".popular-movies .categories__list li")
const swiperFunctions = reloadSwiper();

function reloadSwiper() {
	let popular_movies_swipe = new Swiper(swiper_container, {
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
			360: {
				spaceBetween: 10,
				slidesPerView: 1
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			1024: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
			1440: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
			1900: {
				slidesPerView: 4,
				spaceBetween: 20,
			}
		},
	});

	function checkChanges(newTranslate) {
		popular_movies_swipe.setTranslate(newTranslate);
	}

	return {
		checkChanges: checkChanges,
		popular_movies_swipe: popular_movies_swipe
	};
}


getData(`/movie/upcoming?api_key=${API_KEY}&language=ru-RU`)
	.then(res => {
		reload(res.data.results, anticipated_swiper_container, true)

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
				type: "fraction",
			},
			breakpoints: {
				360: {
					spaceBetween: 10,
					slidesPerView: 1,
					slidesPerGroup: 1
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 15,
					slidesPerGroup: 2

				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 20,
					slidesPerGroup: 3
				},
				1440: {
					slidesPerView: 4,
					slidesPerGroup: 4,
					spaceBetween: 20,
				},
				1900: {
					slidesPerView: 4,
					spaceBetween: 20,
				}
			},
		});
	})







popular_movies.forEach(el => {
	popular_movies[0].classList.add("active")
	getData(`/movie/popular?api_key=${API_KEY}&language=ru-RU`)
		.then(res => {
			reload(res.data.results, swiper)
			reloadSwiper(swiper_container)
		})
	el.onclick = () => {
		swiperFunctions.checkChanges("10")
		let date = el.getAttribute("data-date")
		if (date === "all") {
			getData(`/movie/popular?api_key=${API_KEY}&language=ru-RU`)
				.then(res => {
					reload(res.data.results, swiper)
					reloadSwiper(swiper_container)
					popular_movies.forEach(el => el.classList.remove("active"))
					el.classList.add("active")
				})
		} else {
			getData(`/movie/popular?api_key=${API_KEY}&language=ru-RU&primary_release_year=${date}&certification_country=US&certification.lte=PG-13`)
				.then(res => {
					popular_movies.forEach(el => el.classList.remove("active"))
					el.classList.add("active")
					reload(res.data.results, swiper)
					reloadSwiper(swiper_container)
				})
		}
	}
})