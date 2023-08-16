import { getData } from "/modules/http";

const page_title = document.querySelector("#page-title")
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const movieId = url.searchParams.get("id");
const API_KEY = 'f1d5beaab7f191450fc1bdd4b37d1f96';
const bg_poster = document.querySelector('.bg-poster');

getData(`/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`)
	.then(res => {
		let item = res.data
		page_title.textContent = item.title
		bg_poster.style.backgroundImage = item.backdrop_path ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` : `url(/public/defoult-bg.png)`
	})