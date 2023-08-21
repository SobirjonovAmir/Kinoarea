import { grabScroll } from "./modules/helper";
import { getData, API_KEY } from "./modules/http";

export const categories_list = document.querySelector('.categories__list');
export const trailers_list = document.querySelector('.content__wrapper');
export const in_cinema = document.querySelector('.in-cinema__content');
export const bg_poster = document.querySelector('.bg-poster');

if (trailers_list) {
	grabScroll(trailers_list)
	grabScroll(categories_list)
	
}











