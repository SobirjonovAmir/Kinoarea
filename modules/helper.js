export function grabScroll(container) {
	let isDown = false;
	let startX;
	let scrollLeft;

	container.addEventListener('mousedown', (e) => {
		isDown = true;
		startX = e.pageX - container.offsetLeft;
		scrollLeft = container.scrollLeft;
		container.style.cursor = 'grabbing'
	});
	container.addEventListener('mouseleave', () => {
		isDown = false;
		container.classList.remove('active');
	});
	container.addEventListener('mouseup', () => {
		container.style.cursor = 'grab'
		isDown = false;
		container.classList.remove('active');
	});
	container.addEventListener('mousemove', (e) => {
		if (!isDown) return;
		container.classList.add('active');
		e.preventDefault();
		const x = e.pageX - container.offsetLeft;
		const walk = (x - startX) * 2;
		container.scrollLeft = scrollLeft - walk;
	});
}

export function calculateAge(birthDateString) {
	const birthDate = new Date(birthDateString);
	const currentDate = new Date();

	const age = currentDate.getFullYear() - birthDate.getFullYear();

	if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
		return age - 1;
	}
	return age;
}


export function getAgeString(age) {
	if (age >= 11 && age <= 19) {
		return age + ' лет';
	} else {
		const lastDigit = age % 10;
		if (lastDigit === 1) {
			return age + ' год';
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return age + ' года';
		} else {
			return age + ' лет';
		}
	}
}


export function findRussianName(names) {
	const russianNames = names.filter(name => {
		return /[а-яёА-ЯЁ]/.test(name) && !/українська/i.test(name);
	});
	return russianNames[0];
}