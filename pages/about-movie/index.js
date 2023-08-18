import { getData, API_KEY } from "/modules/http";

const page_title = document.querySelector("#page-title")
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const movieId = url.searchParams.get("id");
const bg_poster = document.querySelector('.bg-poster');
const movie_banner = document.querySelector('.left__banner');
const movie_title = document.querySelector('.movie-title');
const movie_location = document.querySelector('#movie-name');
const movie_original_title = document.querySelector('.movie__original-title');
const movie_descripton = document.querySelector('.movie-description');

getData(`/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`)
	.then(res => {
		let item = res.data
		console.log(item);
		page_title.textContent = item.title
		bg_poster.style.backgroundImage = item.backdrop_path ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` : `url(/public/default-bg.png)`
		movie_banner.style.backgroundImage = item.poster_path ? `url(https://image.tmdb.org/t/p/original${item.poster_path})` : `url(/public/default-poster.jpg)`
		movie_title.textContent = item.title
		movie_location.textContent = item.title
		movie_original_title.textContent = item.original_title
		movie_descripton.textContent = item.overview
	})