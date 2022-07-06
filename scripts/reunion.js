const getRandomInt = (min, max) => {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

const arrayMix = (array) => {
	let j;
	let temp;
	const mixedArr = [ ...array ];

	for (let i = mixedArr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));

		temp = mixedArr[j];
		mixedArr[j] = mixedArr[i];
		mixedArr[i] = temp;
	}

	return mixedArr;
}

class Reunion {
	loaded = false;

	form = document.getElementById('reunionForm');
	prompt = null;
	wrapper = null;
	closeBtn = null;
	container = null;

	images = [];
	video = null;
	music = null;

	onLoad = null;

	cellsAmount = 1;
	delimiterSize = 30;

	timeouts = [];

	constructor() {
		this.onSubmit = this.onSubmit.bind(this);
		this.onClose = this.onClose.bind(this);

		this.init();
	}

	async init() {
		this.prompt = document.createElement('div');
		this.prompt.className = 'reunion';

		this.wrapper = document.createElement('div');
		this.wrapper.className = 'reunion__wrapper';

		this.closeBtn = document.createElement('button');
		this.closeBtn.className = 'reunion__close';

		this.container = document.createElement('div');
		this.container.className = 'reunion__container';

		this.wrapper.appendChild(this.closeBtn);
		this.wrapper.appendChild(this.container);

		this.prompt.appendChild(this.wrapper);

		this.setEvents();
		await this.preloading();

		this.prompt.appendChild(this.video);
		this.prompt.appendChild(this.music);

		document.body.appendChild(this.prompt);
	}

	setEvents() {
		this.form.addEventListener('submit', this.onSubmit);
		this.closeBtn.addEventListener('click', this.onClose);
	}

	removeEvents() {
		this.form.removeEventListener('submit', this.onSubmit);
		this.closeBtn.removeEventListener('click', this.onClose);
	}

	async preloading() {
		const operations = [];

		operations.push(new Promise(res => {
			let counter = 0;

			for (let i = 1; i <= 15; i++) {
				const img = new Image();
				img.src = `assets/photos/${i < 10 ? '0' + i : i}.jpg`;
				img.className = 'reunion__photo';
				img.alt = 'photo';

				img.addEventListener('load', () => {
					this.images.push(img);
					counter += 1;

					if (counter === 14) {
						res();
					}
				});
			}
		}));

		operations.push(new Promise(res => {
			const video = document.createElement('video');

			video.setAttribute('src', 'assets/videos/particles_01.mp4');
			video.className = 'reunion__video';
			video.alt = 'particles';
			video.loop = true;

			video.addEventListener('loadeddata', () => {
				this.video = video;
				res();
			});

			video.load();
		}));

		operations.push(new Promise(res => {
			const sound = new Audio('assets/music/song.mp3');
			sound.loop = true;

			sound.addEventListener('loadeddata', () => {
				this.music = sound;
				res();
			});
		}));

		await Promise.all(operations);

		this.loaded = true;

		if (this.onLoad) {
			this.onLoad();
		}
	}

	show() {
		this.video.play();
		this.music.play();

		this.setSize();

		this.images = arrayMix(this.images);

		this.images.forEach((img, i) => {
			const imageWrapper = document.createElement('div');
			imageWrapper.className = 'reunion__image-wrapper';

			imageWrapper.style.width = `calc(${100 / this.cellsAmount}% - ${this.delimiterSize}px)`;
			img.style.width = `${getRandomInt(70, 100)}%`;
			imageWrapper.appendChild(img);

			this.container.appendChild(imageWrapper);
		});

		this.prompt.classList.add('reunion_visible');
		this.video.classList.add('reunion__video_visible');

		document.body.style.overflow = 'hidden';

		this.images.forEach((img, index) => {
			this.timeouts.push(
				setTimeout(() => {
					img.classList.add('reunion__photo_visible');
					this.wrapper.style.overflowY = 'auto';
				}, (index + 1) * 3000)
			);
		});
	}

	setSize() {
		this.cellsAmount = Math.floor(window.innerWidth / 320);
		this.delimiterSize = (this.cellsAmount - 1) * 10;
	}

	onSubmit(e) {
		e.preventDefault();

		const name = new FormData(this.form).get('name');

		if (name === 'Меркулова') {
			if (this.loaded) {
				this.show();
			} else {
				this.onLoad = () => {
					this.show();
				}
			}
		}
	};

	onClose() {
		this.prompt.classList.remove('reunion_visible');

		this.music.currentTime = 0;
		this.music.pause();

		this.video.currentTime = 0;
		this.video.pause();

		this.container.innerHTML = '';

		for (const img of this.images) {
			img.classList.remove('reunion__photo_visible');
		}

		for (const t of this.timeouts) {
			clearTimeout(t);
		}

		document.body.style.overflow = 'auto';
		this.wrapper.style.overflowY = 'hidden';
	}
}

new Reunion();
