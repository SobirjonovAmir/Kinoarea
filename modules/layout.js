let header = document.querySelector("header")


reloadHeader(header)
function reloadHeader(place) {
	let headerLeft = document.createElement("div");
	headerLeft.className = "header__left";

	let headerLeftLogo = document.createElement("div");
	headerLeftLogo.className = "header__left-logo";

	let logoLink = document.createElement("a");
	logoLink.href = "/";

	let logoImg = document.createElement("img");
	logoImg.src = "/public/logo.svg";
	logoImg.alt = "Kinoarea-logo";

	logoLink.appendChild(logoImg);
	headerLeftLogo.appendChild(logoLink);

	let headerLeftSocial = document.createElement("div");
	headerLeftSocial.className = "header__left-social";

	let socialList = document.createElement("ul");

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
	headerCenter.className = "header__center";

	let navigation = document.createElement("nav");
	navigation.className = "header__center-navigation";

	let navigationList = document.createElement("ul");
	navigationList.className = "navigation__list";

	let navigationItems = [
		"Афиша",
		"Медиа",
		"Фильмы",
		"Актёры",
		"Новости",
		"Подборки",
		"Категории"
	];

	for (let itemText of navigationItems) {
		let listItem = document.createElement("li");
		let link = document.createElement("a");
		link.href = "#";
		link.textContent = itemText;
		listItem.appendChild(link);
		navigationList.appendChild(listItem);
	}

	navigation.appendChild(navigationList);
	headerCenter.appendChild(navigation);

	place.appendChild(headerCenter);

	let headerRight = document.createElement("div");
	headerRight.className = "header__right";

	let searchLink = document.createElement("a");
	searchLink.href = "/pages/about-actor/";

	let searchButton = document.createElement("button");
	searchButton.className = "header__right-search button";

	let searchIcon = document.createElement("img");
	searchIcon.src = "/public/search.svg";
	searchIcon.alt = "search";

	searchButton.appendChild(searchIcon);
	searchLink.appendChild(searchButton);
	headerRight.appendChild(searchLink);

	let loginButton = document.createElement("button");
	loginButton.className = "header__right-login button";

	let loginSpan = document.createElement("span");
	loginSpan.textContent = "Войти";

	loginButton.appendChild(loginSpan);
	headerRight.appendChild(loginButton);

	place.appendChild(headerRight);


}