function copyHeaderPhone() {
	const text = document.getElementById('headerPhone')?.dataset?.phone;

	if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
		try {
			navigator.clipboard.writeText(text);
		} catch (e) {
			console.error('The clipboard api doesn\'t available');
		}
	}
}

function toggleMenu() {
	const menu = document.getElementById('menu');

	menu.classList.toggle('menu_opened');
}

function setEvents() {
	const headerPhoneImage = document.getElementById('headerPhoneImage');
	headerPhoneImage.addEventListener('click', copyHeaderPhone);

	const menu = document.getElementById('menu');
	const button = menu.querySelector('.menu__button');

	button.addEventListener('click', toggleMenu);
}

setEvents();
