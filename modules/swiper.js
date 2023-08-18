import { getData, API_KEY } from "./http";
import { reload } from "./reload";
//import Swiper from 'swiper';
//import { Navigation, Pagination } from 'swiper/modules';

//import 'swiper/css';
//import 'swiper/css/navigation';
//import 'swiper/css/pagination';


//new Swiper(".swiper", {
//	modules: [Navigation, Pagination],

//	navigation: {
//		nextEl: ".swiper-button-next",
//		prevEl: ".swiper-button-prev",
//	},
//});

const swiperContent = document.querySelector('.swiper-content');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const swiperCounter = document.querySelector('.swiper-counter');

let currentIndex = 1;
const itemsPerPage = 4;
let array_length = 0
getData(`/movie/popular?api_key=${API_KEY}&language=ru-RU&page=1`)
	.then(res => {

		array_length = res.data.results.length
		reload(res.data.results.slice(0, 4 * currentIndex), document.querySelector(".swiper-content"))

		function updateCounter() {
			console.log(array_length);
			const totalPages = Math.ceil(array_length / itemsPerPage);
			swiperCounter.textContent = `${currentIndex} / ${totalPages}`;
		}

		prevButton.addEventListener('click', () => {
			if (currentIndex > 0) {
				currentIndex--;

				updateCounter();
			}
		});

		nextButton.addEventListener('click', () => {
			const maxIndex = Math.ceil(swiperContent.children.length / itemsPerPage) - 1;
			if (currentIndex < maxIndex) {
				currentIndex++;

				updateCounter();
			}
		});

		updateCounter();

	})



