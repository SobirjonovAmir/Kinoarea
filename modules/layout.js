import { getData, API_KEY, AUTH_KEY } from "./http"
const user_auth = JSON.parse(localStorage.getItem('user_auth')) || null
const header = document.querySelector("header")
const footer = document.querySelector("footer .container")
reloadHeader(header)
searchReload(header)
reloadEmailing(footer)
scrollTop()


const search_container = document.querySelector(".search-container")
const form = document.querySelector('form');
const search_bg = document.querySelector(".search-bg")
const confirm_btn = document.querySelector(".header__right-confirm")
const login_btn = document.querySelector(".header__right-login")
let reqToken




function reloadHeader(place) {
	let header_top = document.createElement("div");
	let header_bottom = document.createElement("div");
	let headerLeft = document.createElement("div");
	let headerLeftLogo = document.createElement("div");
	let logoLink = document.createElement("a");
	let logoImg = document.createElement("img");
	let headerLeftSocial = document.createElement("div");
	let socialList = document.createElement("ul");
	let leftMenu = document.createElement("div")
	let leftSearchBtn = document.createElement("button");
	let leftSearchIcon = document.createElement("img");
	let burgerMenu = document.createElement("button");

	for (let i = 0; i < 3; i++) {
		const line = document.createElement("span")
		burgerMenu.append(line)
	}

	leftMenu.className = "menu"
	header_top.className = "header__top"
	header_bottom.className = "header__bottom"
	headerLeft.className = "header__left";
	headerLeftLogo.className = "header__left-logo";
	headerLeftSocial.className = "header__left-social";

	leftSearchIcon.src = "/search.svg";
	leftSearchIcon.alt = "search";

	leftSearchBtn.onclick = () => {
		search_container.parentElement.style.display = "block"
		search_bg.style.display = "block"
		search_bg.classList.remove("close")
		search_bg.classList.add("active")
		document.body.style.overflowY = "hidden"
		setTimeout(() => {
			search_container.classList.add("active")
		}, 100);
	}

	leftSearchBtn.classList.add('left-search__button')

	leftSearchBtn.append(leftSearchIcon)
	logoLink.href = "/";

	logoImg.src = "/logo.svg";
	logoImg.alt = "Kinoarea-logo";
	logoLink.appendChild(logoImg);
	headerLeftLogo.appendChild(logoLink);



	let socialIcons = [
		"/vk-logo.svg",
		"/instagram-logo.svg",
		"/facebook.svg",
		"/twitter.svg"
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

	let navigation_bottom = document.createElement("nav");
	let navigationList_bottom = document.createElement("ul");
	let navigationItems_bottom = [
		"Афиша",
		"Медиа",
		"Фильмы",
		"Актёры",
		"Новости",
		"Подборки",
		"Категории"
	];

	navigation_bottom.className = "header__bottom-navigation";
	navigationList_bottom.className = "navigation__list-bottom";

	for (let itemText of navigationItems_bottom) {
		let listItem = document.createElement("li");
		let link = document.createElement("a");
		link.href = "#";
		link.textContent = itemText;
		listItem.append(link);
		navigationList_bottom.append(listItem);
	}

	navigation_bottom.append(navigationList_bottom);
	header_bottom.append(navigation_bottom)


	const divLoged = document.createElement('div');
	const details = document.createElement('details');
	const summary = document.createElement('summary');
	const detailsWrapper = document.createElement('div');
	const span1 = document.createElement('span');
	const span2 = document.createElement('span');
	const divUserFoto = document.createElement('div');
	const img = document.createElement('img');


	divUserFoto.onclick = () => {
		location.assign(`/pages/profile/`)
	}
	span1.onclick = () => {
		location.assign(`/pages/profile/`)
	}

	span2.onclick = () => {
		localStorage.removeItem("user_auth")
		location.reload()
	}


	summary.textContent = 'Amir';
	summary.id = 'user-name';
	divLoged.classList.add('loged');
	detailsWrapper.classList.add('details-wrapper');
	divUserFoto.classList.add('user-foto');
	span1.textContent = 'Кабинет';
	span2.textContent = 'Выйти';

	img.alt = 'user-foto';


	details.append(summary, detailsWrapper);
	detailsWrapper.append(span1, span2);
	divUserFoto.append(img);
	divLoged.append(details, divUserFoto);


	let headerRight = document.createElement("div");
	let searchButton = document.createElement("button");
	let searchIcon = document.createElement("img");
	let loginButton = document.createElement("button");
	let confirmButton = document.createElement("button");
	let loginSpan = document.createElement("span");

	headerRight.className = "header__right";
	searchButton.className = "header__right-search button";
	loginButton.className = "header__right-login button";
	confirmButton.className = "header__right-confirm button";
	loginSpan.textContent = "Войти";
	confirmButton.textContent = "Подтвердить";
	searchIcon.src = "/search.svg";
	searchIcon.alt = "search";

	searchButton.onclick = () => {
		search_container.parentElement.style.display = "block"
		search_bg.style.display = "block"
		search_bg.classList.remove("close")
		search_bg.classList.add("active")
		document.body.style.overflowY = "hidden"
		setTimeout(() => {
			search_container.classList.add("active")
		}, 100);
	}


	if (user_auth) {
		fetch(`https://api.themoviedb.org/3/account/${user_auth?.account_id}`, {
			headers: {
				Authorization: `Bearer ${AUTH_KEY}`,
				'Content-Type': "application/json"
			},
		})
			.then(res => res.json())
			.then(res => {
				localStorage.setItem('user_data', JSON.stringify(res))
				loginButton.style.display = "none"
				divLoged.style.display = "flex"
				img.src = `https://www.gravatar.com/avatar/${res.avatar.gravatar.hash}`
				summary.innerHTML = res.name
			})
	} else {
		loginButton.style.display = "block"
	}

	searchButton.append(searchIcon);
	headerRight.append(searchButton);
	loginButton.append(loginSpan);
	headerRight.append(loginButton, confirmButton, divLoged);

	leftMenu.append(burgerMenu, leftSearchBtn)
	header_top.append(leftMenu, headerLeft, headerCenter, headerRight);
	place.append(header_top, header_bottom)
}

function reloadEmailing(place) {
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

	mailingForm.onsubmit = (event) => {
		event.preventDefault();
		let data = {}

		if (emailInput.value == "") {
			emailInput.style.borderBottom = "1.2px solid red"
			return
		}
		emailInput.style.border = "none"
		document.querySelector("form .checkmark").style.background = "#ccc"

		if (privacyCheckbox.checked) {
			data.email = emailInput.value
			console.log(data)

			form.reset()
		} else {
			document.querySelector("form .checkmark").style.background = "red"
		}
	};

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
	mailingLogoImage.src = '/mailing-logo.svg';
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

	place.append(mailingSection);


	//! секция для навигации футера
	const footerNavigationSection = document.createElement('section');
	const footerNavTop = document.createElement('div');
	const socialList = document.createElement('ul');

	footerNavigationSection.className = 'footer-navigation';
	footerNavTop.className = 'footer-navigation__top';
	socialList.className = 'social-list';

	const socialLinksData = [
		{ href: '#', src: '/vk-logo.svg', alt: 'vk' },
		{ href: '#', src: '/instagram-logo.svg', alt: 'instagram' },
		{ href: '#', src: '/facebook.svg', alt: 'facebook' },
		{ href: '#', src: '/twitter.svg', alt: 'twitter' },
		{ href: '#', src: '/youtube-logo.svg', alt: 'youtube' }
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

	place.append(footerNavigationSection);
}

function searchReload(place) {
	let searchBg = document.createElement('div');
	let search = document.createElement("div")
	let search_wrapper = document.createElement("div")
	let searchContainer = document.createElement('div');
	let logoImage = document.createElement('img');
	let searchForm = document.createElement('form');
	let searchInput = document.createElement('input');

	searchForm.onsubmit = (e) => {
		e.preventDefault()

		if (searchInput.value !== '') {
			getData(`/search/multi?query=${searchInput.value}&language=ru-RU&page=1`)
				.then(res => {
					let results = res.data.results
					if (results.length !== 0) {
						reloadSearchComponents(results, search_wrapper)
					} else {
						search_wrapper.innerHTML = "По вашему запросу ничего не найдено"
					}
					e.target.reset()
				})
		} else {
			searchInput.focus()
		}
	}

	searchBg.classList.add('search-bg');
	search.classList.add("search")
	search_wrapper.classList.add("search-wrapper")
	searchContainer.classList.add('search-container');


	logoImage.src = '/logo.svg';
	logoImage.alt = 'Kinoarea';
	searchForm.name = 'search';
	searchInput.type = 'text';
	searchInput.placeholder = 'Поиск...';


	let searchButton = document.createElement('button');
	searchButton.id = 'search-button';
	searchButton.type = 'submit';

	let searchIconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	let searchPath = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	let pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	let circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	searchIconSVG.classList.add('svg-icon', 'search-icon');
	searchIconSVG.setAttribute('aria-labelledby', 'title desc');
	searchIconSVG.setAttribute('role', 'img');
	searchIconSVG.setAttribute('viewBox', '0 0 19.9 19.7');
	searchPath.setAttribute('fill', 'none');
	searchPath.setAttribute('stroke', '#000');
	pathElement.setAttribute('stroke-linecap', 'square');
	pathElement.setAttribute('d', 'M18.5 18.3l-5.4-5.4');
	circleElement.setAttribute('cx', '8');
	circleElement.setAttribute('cy', '8');
	circleElement.setAttribute('r', '7');

	searchPath.append(pathElement, circleElement);
	searchIconSVG.append(searchPath);
	searchButton.append(searchIconSVG);

	let closeButton = document.createElement('button');
	closeButton.className = 'close-search';
	closeButton.type = 'reset';

	closeButton.onclick = () => {
		search_wrapper.innerHTML = ""
		searchContainer.classList.remove("active")
		searchBg.classList.remove("active")
		searchBg.classList.add("close")
		setTimeout(() => {
			document.body.style.overflowY = "auto"
			search.style.display = "none"
			searchBg.style.display = "none"
		}, 500);
	}

	let closeIcon = document.createElement("img");
	closeIcon.src = "/close.svg"

	closeButton.append(closeIcon);
	searchButton.append(searchIconSVG);
	searchForm.append(searchInput, searchButton, closeButton);
	searchContainer.append(logoImage, searchForm, search_wrapper)

	search.append(searchContainer)

	place.append(searchBg, search);
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

		if (item.poster_path) {
			img.src = `https://image.tmdb.org/t/p/original${item.poster_path}`
		} else if (item.profile_path) {
			img.src = `https://image.tmdb.org/t/p/original${item.profile_path}`
		} else {
			img.src = `/public/default-poster.svg`
		}


		console.log(item);
		div.onclick = () => {
			window.open("/pages/about-movie/?id=" + item.id, '_blank')
		}

		div.append(img_box, title_box, rating)
		img_box.append(img)
		title_box.append(title, orig_title, all_genres)

		place.append(div)
	}
}

function scrollTop() {
	const scrollToTopBtn = document.createElement('button')
	scrollToTopBtn.classList.add("scroll-top")
	const arrowTopImg = document.createElement("img")
	arrowTopImg.src = "/arrow-top.svg"
	scrollToTopBtn.append(arrowTopImg)
	header.append(scrollToTopBtn)

	window.addEventListener("scroll", () => {
		if (window.scrollY > 400) {
			scrollToTopBtn.classList.add("active");
		} else {
			scrollToTopBtn.classList.remove("active");
		}
	});

	scrollToTopBtn.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
}




login_btn.onclick = () => {
	fetch('https://api.themoviedb.org/4/auth/request_token', {
		method: 'POST',
		dataType: 'json',
		headers: {
			Authorization: `Bearer ${AUTH_KEY}`,
			'Content-Type': "application/json"
		},
		start_time: new Date().getTime()
	})
		.then(res => res.json())
		.then(res => {
			if (res.success) {
				reqToken = res.request_token
				window.open(`https://www.themoviedb.org/auth/access?request_token=${res.request_token}`)
				login_btn.style.display = "none"
				confirm_btn.style.display = "block"
			}
		})
}

confirm_btn.onclick = () => {
	fetch(`https://api.themoviedb.org/4/auth/access_token`, {
		method: 'POST',
		dataType: 'json',
		headers: {
			Authorization: `Bearer ${AUTH_KEY}`,
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			request_token: reqToken
		}),
		start_time: new Date().getTime()
	})
		.then(res => res.json())
		.then(res => {
			if (res.success) {
				localStorage.setItem('user_auth', JSON.stringify(res))
				location.reload()
			} else {
				alert("Не удалось авторизоваться")
				login_btn.style.display = "block"
				confirm_btn.style.display = "none"
			}
		})
}

