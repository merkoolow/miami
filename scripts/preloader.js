async function preloadImage(id, link, background = false) {
	const element = document.getElementById(id);

	return new Promise(res => {
		const img = new Image();
		img.src = link;

		img.onload = () => {
			if (background) {
				const computedStyles = getComputedStyle(element);

				element.style.backgroundImage = `url(${img.src})`;
				element.style.backgroundPosition = computedStyles.backgroundPosition;
				element.style.backgroundSize = computedStyles.backgroundSize;
				element.style.backgroundRepeat = computedStyles.backgroundRepeat;
			}

			res();
		};
	});
}

function onLoad() {
		preloadImage('header', 'assets/images/header_background_high.jpg', true);
		preloadImage('footer', 'assets/images/footer_background_high.jpg', true);

		window.removeEventListener('load', onLoad);
}

window.addEventListener('load', onLoad);
