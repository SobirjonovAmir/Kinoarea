import { getData, API_KEY } from "./http"
let header = document.querySelector("header")
let footer = document.querySelector("footer .container")
searchReload()
let search_wrapper = document.querySelector(".search-wrapper")
let search_input = document.querySelector("form input")


document.querySelector("form").onsubmit = (e) => {
	e.preventDefault()

	console.log(search_wrapper);
	if (search_input !== '') {
		getData(`/search/multi?query=${search_input.value}&include_adult=false&language=ru-RU&page=1'`)
			.then(res => {
				let results = res.data.results

				reloadSearchComponents(results, search_wrapper)

				e.target.reset()
			})
	}
}

function reloadSearchComponents(arr, place) {
	place.innerHTML = ""
	for (const item of arr) {
		const div = document.createElement("div")
		const img_box = document.createElement("div")
		const img = document.createElement("img")
		const title_box = document.createElement("div")
		const all_genres = document.createElement("span")
		const title = document.createElement("h3")
		const orig_title = document.createElement("h4")
		const rating = document.createElement("span")

		div.classList.add("wrapper-item")
		img_box.classList.add("img-box")
		rating.classList.add("rating")
		all_genres.classList.add("genres")

		getData(`/genre/movie/list?api_key=${API_KEY}&language=ru-RU`)
			.then(res => {
				let genres = res.data.genres;
				let finded = []
				if (item.genre_ids) {
					item.genre_ids.forEach(genre_id => {
						const genre = genres.find(genre => genre.id === genre_id);
						if (genre) {
							finded.push(genre.name)
						}
					})
					all_genres.innerHTML = finded.join(", ")
					all_genres.title = finded.join(", ")
				}
			})

		title.innerHTML = item.name ? item.name : item.title
		orig_title.innerHTML = item.original_name ? item.original_name : item.original_title
		rating.innerHTML = item.vote_average ? (+item.vote_average).toFixed(2) : (+item.popularity).toFixed(2)
		img.src = item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : `/public/default-poster.svg`

		div.onclick = () => {
			window.open("/pages/about-movie/?id=" + item.id, '_blank')
		}

		div.append(img_box, title_box, rating)
		img_box.append(img)
		title_box.append(title, orig_title, all_genres)

		place.append(div)
	}
}


reloadHeader(header)
function reloadHeader(place) {
	let headerLeft = document.createElement("div");
	let headerLeftLogo = document.createElement("div");
	let logoLink = document.createElement("a");
	let logoImg = document.createElement("img");
	let headerLeftSocial = document.createElement("div");
	let socialList = document.createElement("ul");


	headerLeft.className = "header__left";
	headerLeftLogo.className = "header__left-logo";
	headerLeftSocial.className = "header__left-social";

	logoLink.href = "/";

	logoImg.src = "/public/logo.svg";
	logoImg.alt = "Kinoarea-logo";

	logoLink.appendChild(logoImg);
	headerLeftLogo.appendChild(logoLink);



	let socialIcons = [
		"/public/vk-logo.svg",
		"/public/instagram-logo.svg",
		"/public/facebook.svg",
		"/public/twitter.svg"
	];

	for (let iconSrc of socialIcons) {
		let listItem = document.createElement("li");
		let link = document.createElement("a");
		let iconImg = document.createElement("img");

		link.href = "#";
		iconImg.src = iconSrc;
		iconImg.alt = "social-icon";

		link.appendChild(iconImg);
		listItem.appendChild(link);
		socialList.appendChild(listItem);
	}

	headerLeftSocial.appendChild(socialList);
	headerLeft.appendChild(headerLeftLogo);
	headerLeft.appendChild(headerLeftSocial);
	place.appendChild(headerLeft);


	let headerCenter = document.createElement("div");
	let navigation = document.createElement("nav");
	let navigationList = document.createElement("ul");
	let navigationItems = [
		"Афиша",
		"Медиа",
		"Фильмы",
		"Актёры",
		"Новости",
		"Подборки",
		"Категории"
	];

	headerCenter.className = "header__center";
	navigation.className = "header__center-navigation";
	navigationList.className = "navigation__list";

	for (let itemText of navigationItems) {
		let listItem = document.createElement("li");
		let link = document.createElement("a");
		link.href = "#";
		link.textContent = itemText;
		listItem.append(link);
		navigationList.append(listItem);
	}

	navigation.append(navigationList);
	headerCenter.append(navigation);
	place.append(headerCenter);

	let headerRight = document.createElement("div");
	let searchLink = document.createElement("a");
	let searchButton = document.createElement("button");
	let searchIcon = document.createElement("img");
	let loginButton = document.createElement("button");
	let loginSpan = document.createElement("span");

	headerRight.className = "header__right";
	searchButton.className = "header__right-search button";
	loginButton.className = "header__right-login button";
	loginSpan.textContent = "Войти";
	searchLink.href = "#";
	searchIcon.src = "/public/search.svg";
	searchIcon.alt = "search";



	searchButton.append(searchIcon);
	searchLink.append(searchButton);
	headerRight.append(searchLink);
	loginButton.append(loginSpan);
	headerRight.append(loginButton);

	place.append(headerRight);
}


//! секция для E-mail рассылки
const mailingSection = document.createElement('section');
const mailingLogo = document.createElement('div');
const mailingLogoImage = document.createElement('img');
const mailingTitle = document.createElement('h3');
const mailingDescription = document.createElement('p');
const mailingForm = document.createElement('form');
const formTop = document.createElement('div');
const emailInput = document.createElement('input');
const subscribeButton = document.createElement('button');
const privacyDiv = document.createElement('div');
const privacyLabel = document.createElement('label');
const privacyCheckbox = document.createElement('input');
const checkboxSpan = document.createElement('span');
const privacyText = document.createElement('p');

mailingSection.className = 'mailing-list';
mailingLogo.className = 'logo';
mailingTitle.className = 'mailing-list__title';
mailingDescription.className = 'mailing-list__description';
formTop.className = 'form-top';
privacyDiv.className = 'privacy';
privacyLabel.className = 'custom-checkbox';
checkboxSpan.className = 'checkmark';

emailInput.autocomplete = "email"
privacyCheckbox.autocomplete = "off"
privacyCheckbox.name = "checkbox"
mailingForm.name = "mailing_form"
mailingForm.action = '';
mailingLogoImage.src = '/public/mailing-logo.svg';
mailingLogoImage.alt = 'Kinoarea';
emailInput.placeholder = 'Введите свой E-mail адрес';
emailInput.type = 'email';
emailInput.name = "email"
subscribeButton.type = 'submit';
privacyCheckbox.type = 'checkbox';
subscribeButton.textContent = 'Подписаться';
mailingTitle.textContent = 'Подпишитесь на E-mail рассылку';
mailingDescription.textContent = 'Если хотите быть в курсе последних новостей и новинок кино - заполните форму ниже и оформите бесплатную E-mail рассылку!';
privacyText.innerHTML = 'Соглашаюсь на условия <a href="#" class="mark">политики конфиденциальности</a>';

mailingLogo.append(mailingLogoImage);
formTop.append(emailInput, subscribeButton);
privacyLabel.append(privacyCheckbox, checkboxSpan);
privacyDiv.append(privacyLabel, privacyText);
mailingForm.append(formTop, privacyDiv);
mailingSection.append(mailingLogo, mailingTitle, mailingDescription, mailingForm);

footer.append(mailingSection);


//! секция для навигации футера
const footerNavigationSection = document.createElement('section');
const footerNavTop = document.createElement('div');
const socialList = document.createElement('ul');

footerNavigationSection.className = 'footer-navigation';
footerNavTop.className = 'footer-navigation__top';
socialList.className = 'social-list';

const socialLinksData = [
	{ href: '#', src: '/public/vk-logo.svg', alt: 'vk' },
	{ href: '#', src: '/public/instagram-logo.svg', alt: 'instagram' },
	{ href: '#', src: '/public/facebook.svg', alt: 'facebook' },
	{ href: '#', src: '/public/twitter.svg', alt: 'twitter' },
	{ href: '#', src: '/public/youtube-logo.svg', alt: 'youtube' }
];

socialLinksData.forEach(linkData => {
	const socialListItem = document.createElement('li');
	const socialLink = document.createElement('a');
	const socialImage = document.createElement('img');
	socialListItem.className = 'social-list__item';
	socialLink.href = linkData.href;
	socialImage.src = linkData.src;
	socialImage.alt = linkData.alt;
	socialLink.append(socialImage);
	socialListItem.append(socialLink);
	socialList.append(socialListItem);
});

footerNavTop.append(socialList);

const footerNavCenter = document.createElement('nav');
const navigationList = document.createElement('ul');
const navigationLinksData = ['Афиша', 'Медиа', 'Фильмы', 'Актёры', 'Новости', 'Подборки', 'Категории'];

footerNavCenter.className = 'footer-navigation-center';
navigationList.className = 'navigation__list';

navigationLinksData.forEach(linkText => {
	const navigationListItem = document.createElement('li');
	const navigationLink = document.createElement('a');
	navigationLink.href = '#';
	navigationLink.textContent = linkText;
	navigationListItem.append(navigationLink);
	navigationList.append(navigationListItem);
});

const footerNavBottom = document.createElement('div');
const copyrightText = document.createElement('p');
const privacyLink = document.createElement('a');

footerNavBottom.className = 'footer-navigation__bottom';
copyrightText.textContent = '2020 © Kinoarea. Все права защищены';
privacyLink.href = '#';
privacyLink.textContent = 'Политика конфиденциальности';

footerNavCenter.append(navigationList);
footerNavBottom.append(copyrightText, privacyLink);
footerNavigationSection.append(footerNavTop, footerNavCenter, footerNavBottom);

footer.append(footerNavigationSection);




const form = document.querySelector('form');
const formInput = form.querySelector('input[type="email"]');
const formCheckbox = form.querySelector('.privacy input[type="checkbox"]');
const submitButton = form.querySelector('button[type="submit"]');

form.onsubmit = (event) => {
	event.preventDefault();
	let data = {}

	if (formInput.value == "") {
		formInput.style.borderBottom = "1.2px solid red"
		return
	}
	formInput.style.border = "none"
	document.querySelector("form .checkmark").style.background = "#ccc"

	if (formCheckbox.checked) {

		data.email = formInput.value
		console.log(data)

		form.reset()
	} else {
		document.querySelector("form .checkmark").style.background = "red"
	}
};




function searchReload() {
	let searchBg = document.createElement('div');
	searchBg.classList.add('search-bg');
	searchBg.id = "close-search"

	let search = document.createElement("div")
	search.classList.add("search")
	let search_wrapper = document.createElement("div")
	search_wrapper.classList.add("search-wrapper")

	let searchContainer = document.createElement('div');
	searchContainer.classList.add('search-container');

	let logoImage = document.createElement('img');
	logoImage.src = '/logo.svg';
	logoImage.alt = 'Kinoarea';

	let searchForm = document.createElement('form');
	searchForm.name = 'search';
	searchForm.action = '#';

	let searchInput = document.createElement('input');
	searchInput.type = 'text';
	searchInput.placeholder = 'Поиск...';

	let searchButton = document.createElement('button');
	searchButton.id = 'search-button';
	searchButton.type = 'submit';

	let searchIconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	searchIconSVG.classList.add('svg-icon', 'search-icon');
	searchIconSVG.setAttribute('aria-labelledby', 'title desc');
	searchIconSVG.setAttribute('role', 'img');
	searchIconSVG.setAttribute('viewBox', '0 0 19.9 19.7');

	let titleElement = document.createElement('title');
	titleElement.id = 'title';
	titleElement.textContent = 'Search Icon';
	searchIconSVG.appendChild(titleElement);

	let descElement = document.createElement('desc');
	descElement.id = 'desc';
	descElement.textContent = 'A magnifying glass icon.';
	searchIconSVG.appendChild(descElement);

	let searchPath = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	searchPath.classList.add('search-path');
	searchPath.setAttribute('fill', 'none');
	searchPath.setAttribute('stroke', '#000');

	let pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	pathElement.setAttribute('stroke-linecap', 'square');
	pathElement.setAttribute('d', 'M18.5 18.3l-5.4-5.4');
	searchPath.appendChild(pathElement);

	let circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circleElement.setAttribute('cx', '8');
	circleElement.setAttribute('cy', '8');
	circleElement.setAttribute('r', '7');
	searchPath.appendChild(circleElement);

	searchIconSVG.appendChild(searchPath);
	searchButton.appendChild(searchIconSVG);

	let closeButton = document.createElement('button');
	closeButton.id = 'close-search';
	closeButton.type = 'reset';

	let closeIconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	closeIconSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	closeIconSVG.setAttribute('width', '22');
	closeIconSVG.setAttribute('height', '24');
	closeIconSVG.setAttribute('viewBox', '0 0 22 24');
	closeIconSVG.setAttribute('fill', '#000');

	let closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	closePath.setAttribute('d', 'M2 2L22 21.9067M22 2.09332L2 22');
	closePath.setAttribute('stroke', 'white');
	closePath.setAttribute('stroke-width', '3');
	closePath.setAttribute('stroke-linecap', 'round');
	closePath.setAttribute('stroke-linejoin', 'round');
	closeIconSVG.appendChild(closePath);

	closeButton.appendChild(closeIconSVG);

	searchButton.appendChild(searchIconSVG);

	searchForm.append(searchInput, searchButton, closeButton);

	searchContainer.append(logoImage, searchForm, search_wrapper)

	search.append(searchContainer)

	document.body.append(searchBg, search);
}



let open_search = document.querySelector(".header__right-search")
let search_bg = document.querySelector(".search-bg")
let close_search = document.querySelectorAll("#close-search")

open_search.onclick = () => {
	search_wrapper.parentElement.parentElement.style.display = "block"
	search_bg.style.display = "block"
	document.body.style.overflow = "hidden"
}

close_search.forEach(btn => {
	btn.onclick = () => {
		console.log("afsa");
		search_wrapper.innerHTML = ""
		search_wrapper.parentElement.parentElement.style.display = "none"
		search_bg.style.display = "none"
		document.body.style.overflow = "auto"
	}
})