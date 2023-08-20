import { getData, API_KEY } from "./http";
import { reload } from "./reload";

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper_container = document.querySelector(".swiper")
const swiper = document.querySelector(".swiper-wrapper")


function reloadSwiper(place) {
	swiper.style.display = "translate3d(200px 0px 0px)"
	new Swiper(place, {
		modules: [Navigation],
		slidesPerView: 4,
		spaceBetween: 20,
		grabCursor: true,
		freeMode: true,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
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
				slidesPerView: 3,
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
}






let popular_movies = document.querySelectorAll(".popular-movies .categories__list li")


popular_movies.forEach(el => {
	popular_movies[0].classList.add("active")
	getData(`/movie/popular?api_key=${API_KEY}&language=ru-RU`)
		.then(res => {
			reload(res.data.results, swiper)
			reloadSwiper(swiper_container)
		})
	el.onclick = () => {
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