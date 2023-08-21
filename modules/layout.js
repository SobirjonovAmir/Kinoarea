let header = document.querySelector("header")
let miling_list = document.querySelector(".mailing-list")
let footer_navigation = document.querySelector(".footer-navigation")
let footer = document.querySelector("footer .container")


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
	searchLink.href = "/pages/about-actor/";
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
