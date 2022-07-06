class Slider {
	translate = 0;
	next = 0;
	diff = 0;

	hiddenElements = 0;
	elementsBehind = 0;
	freeSlideTimeout = null;

	slider = null;
	wrapper = null;
	list = null;
	btnLeft = null;
	btnRight = null;

	animation = {
		prev: 0,
		speed: 0.5,
		acceleration: 1,
		maxAcceleration: 8,
		maxClickAcceleration: 2,
		direction: 'left',
		freeSlide: false,
		pending: false,
		inertia: false
	}

	constructor() {
		this.setSliderSize = this.setSliderSize.bind(this);
		this.slide = this.slide.bind(this);
		this.update = this.update.bind(this);

		this.init();
	}

	async init() {
		this.slider = document.getElementById('testimonialsSlider');
		this.wrapper = this.slider.querySelector('.slider__wrapper');
		this.list = this.slider.querySelector('.slider__list');
		this.btnLeft = this.slider.querySelector('.slider__button_left');
		this.btnRight = this.slider.querySelector('.slider__button_right');

		await this.fillSlider();

		this.setSliderSize();
		this.setEvents();
	}

	setEvents() {
		window.addEventListener('resize', this.setSliderSize);

		this.btnLeft.addEventListener('pointerdown', (e) => this.slide('left'));
		this.btnRight.addEventListener('pointerdown', (e) => this.slide('right'));

		this.btnLeft.addEventListener('pointerup', (e) => {
			clearTimeout(this.freeSlideTimeout);

			if (this.animation.freeSlide) {
				this.animation.inertia = true;
				this.animation.freeSlide = false;
			}
		});

		this.btnRight.addEventListener('pointerup', (e) => {
			clearTimeout(this.freeSlideTimeout);

			if (this.animation.freeSlide) {
				this.animation.inertia = true;
				this.animation.freeSlide = false;
			}
		});

		this.btnLeft.addEventListener('pointerout', () => {
			clearTimeout(this.freeSlideTimeout);

			if (this.animation.freeSlide) {
				this.animation.inertia = true;
				this.animation.freeSlide = false;
			}
		});

		this.btnRight.addEventListener('pointerout', () => {
			clearTimeout(this.freeSlideTimeout);

			if (this.animation.freeSlide) {
				this.animation.inertia = true;
				this.animation.freeSlide = false;
			}
		});
	}

	removeEvents() {
		window.removeEventListener('resize', this.setSliderSize);

		this.btnLeft.replaceWith(this.btnLeft.cloneNode(true));
		this.btnRight.replaceWith(this.btnRight.cloneNode(true));
	}

	async getReviews() {
		const data = await fetch('https://testimonialapi.toolcarton.com/api', {
			method: 'GET',
			redirect: 'follow'
		});

		return await data.json();
	}

	async fillSlider() {
		const reviews = await this.getReviews();
		const multipliedReviews = [];

		for (let i = 0; i < 1; i++) {
			multipliedReviews.push(...reviews);
		}

		let innerHtml = '';

		for (const r of multipliedReviews) {
			const element = `
			<li class="card">
				<div class="card__avatar">
					<img src="${r.avatar}" alt="avatar">
				</div>
				<div class="card__name">
					<p>${r.name}</p>
				</div>
				<div class="card__position">
					<p>${r.designation}</p>
				</div>
				<div class="card__comment">
					<p class="card__comment-text">&ldquo;${r.message}&rdquo;</p>
				</div>
			</li>
		`;

			innerHtml += element;
		}

		this.list.innerHTML = innerHtml;
	}

	setSliderSize() {
		if (this.animation.pending) {
			this.stop();
			this.translate = this.next;
			this.applyTransition();
			return ;
		}

		const additionalWidth = parseInt(window.getComputedStyle(this.btnLeft).width, 10) +
			parseInt(window.getComputedStyle(this.btnLeft).marginLeft, 10) +
			parseInt(window.getComputedStyle(this.btnLeft).marginRight, 10) +
			parseInt(window.getComputedStyle(this.btnRight).width, 10) +
			parseInt(window.getComputedStyle(this.btnRight).marginLeft, 10)
		parseInt(window.getComputedStyle(this.btnRight).marginRight, 10);

		const maxWidth = parseInt(window.getComputedStyle(this.slider, 'after').width, 10) - additionalWidth;

		const element = this.slider.querySelector('.card');
		const elementSize = parseInt(window.getComputedStyle(element).width, 10) + 24;
		const totalCards = this.slider.querySelectorAll('.card').length;

		let amount = Math.floor(maxWidth / elementSize);

		if (amount === 0) {
			amount = 1;
		}

		this.hiddenElements = totalCards - amount;

		if (amount > totalCards - this.elementsBehind) {
			this.translate = this.translate + elementSize;
			this.startTranslation(true);
			this.elementsBehind -= 1;
		}

		const width = amount * elementSize;

		this.wrapper.style.width = width + 'px';

		this.translate = this.elementsBehind * -elementSize;

		this.applyTransition();
	}

	slide(direction, freeSlide = false, inertia = false) {
		if (!inertia) {
			if (this.animation.freeSlide) {
				this.animation.freeSlide = true;
			} else {
				this.freeSlideTimeout = setTimeout(() => {
					this.animation.freeSlide = true;
				}, this.animation.speed * 1000 - 100);
			}
		}

		if (this.animation.pending && direction !== this.animation.direction) {
			return ;
		}

		const card = this.slider.querySelector('.card');
		const cardSize = parseInt(window.getComputedStyle(card).width, 10) + 24;

		this.diff = cardSize;

		if (this.animation.pending || freeSlide || inertia) {
			if (direction === 'left' && this.next < 0) {
				this.next += cardSize;
				this.elementsBehind -= 1;

				if (!inertia && !freeSlide && this.animation.acceleration < this.animation.maxClickAcceleration) {
					this.animation.acceleration *= 1.1;
				} else if (!inertia && !freeSlide && this.animation.acceleration > this.animation.maxClickAcceleration) {
					this.animation.acceleration = this.animation.maxClickAcceleration;
				}

			} else if (direction === 'right' && this.next > (cardSize * this.hiddenElements) * - 1) {
				this.next -= cardSize;
				this.elementsBehind += 1;

				if (!inertia && !freeSlide && this.animation.acceleration < this.animation.maxClickAcceleration) {
					this.animation.acceleration *= 1.1;
				} else if (!inertia && !freeSlide && this.animation.acceleration > this.animation.maxClickAcceleration) {
					this.animation.acceleration = this.animation.maxClickAcceleration;
				}

			} else if (freeSlide || inertia) {
				this.animation.freeSlide = false;
				this.animation.inertia = false;
			}

			return ;
		}

		if (direction === 'left' && this.translate < 0) {
			this.next = this.translate + cardSize;
			this.animation.direction = direction;
			this.elementsBehind -= 1;
		} else if (direction === 'right' && this.translate > (cardSize * this.hiddenElements) * - 1) {
			this.next = this.translate - cardSize;
			this.animation.direction = direction;
			this.elementsBehind += 1;
		}

		if (this.translate !== this.next) {
			this.startTranslation();
		}
	}

	startTranslation(immediately = false) {
		if (immediately) {
			this.list.style.transform = 'translateX(' + this.translate + 'px)';

			this.next = this.translate;
		} else {
			this.animation.pending = true;

			this.wrapper.classList.add('slider__wrapper_moving');

			window.requestAnimationFrame(this.update);
		}
	}

	applyTransition() {
		this.list.style.transform = 'translateX(' + this.translate + 'px)';
	}

	freeSlide() {
		this.animation.acceleration *= 1.4;

		if (this.animation.acceleration >= this.animation.maxAcceleration) {
			this.animation.acceleration = this.animation.maxAcceleration;
		}

		this.slide(this.animation.direction, true);
	}

	inertia() {
		this.slide(this.animation.direction, false, true);
	}

	stop() {
		this.translate = this.next;
		this.animation.prev = 0;
		this.animation.acceleration = 1;
		this.animation.pending = false;

		this.wrapper.classList.remove('slider__wrapper_moving');
	}

	update(delta) {
		if (this.next === this.translate) {
			return ;
		}

		if (this.animation.prev === 0) {
			this.animation.prev = delta;
		}

		const dt = delta - this.animation.prev;
		const val = dt * 75 / 1000;
		const currentSpeed = this.animation.speed / this.animation.acceleration;
		const step = (this.diff / 75) / currentSpeed;

		if (this.animation.inertia && this.animation.acceleration > 0.5) {
			this.animation.acceleration -= 0.06;
		} else if (this.animation.acceleration <= 0.5) {
			this.animation.inertia = false;
		}

		if (this.animation.direction === 'left') {
			this.translate += step * val;

			if (this.next <= this.translate) {
				if (this.animation.freeSlide) {
					this.freeSlide();
				} else if (this.animation.inertia) {
					this.inertia();
				} else {
					this.stop();
				}
			}
		} else {
			this.translate -= step * val;

			if (this.next >= this.translate) {
				if (this.animation.freeSlide) {
					this.freeSlide();
				} else if (this.animation.inertia) {
					this.inertia();
				} else {
					this.stop();
				}
			}
		}

		this.applyTransition();

		if (this.next !== this.translate) {
			this.animation.prev = delta;
			window.requestAnimationFrame(this.update);
		}
	}
}

const slider = new Slider();
