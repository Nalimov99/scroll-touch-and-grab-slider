export default class Slider {
	constructor(selector) {
		this.activeIndex = 0;
		this.wrapper = document.querySelector(selector);
		this.slider = this.wrapper.querySelector(".ae-widget__slider");
		this.slides = this.wrapper.querySelectorAll(".ae-widget__slider-item");
		this._isHandleUp = false;

		this.bindEvents();
	}

	//HANDLERS
	bindEvents() {
		this.onGrab();
		this.onNext();
		this.onPrev();
		this.onScroll();
	}

	onNext() {
		const next = this.wrapper.querySelector(".ae-widget__slider-next");

		next.addEventListener("click", () => {
			if (this.slides.length - 1 === this.activeIndex) {
				this.activeIndex = 0;
			} else {
				this.activeIndex += 1;
			}

			this.scrollToTheSlide();
		})
	}

	onPrev() {
		const prev = this.wrapper.querySelector(".ae-widget__slider-prev")

		prev.addEventListener("click", () => {
			if (this.activeIndex === 0) {
				this.activeIndex = this.slides.length - 1;
			} else {
				this.activeIndex -= 1;
			}

			this.scrollToTheSlide();
		})
	}

	onGrab() {
		const pos = { left: 0, x: 0 };

		const endHandler = (e) => {
			this.slider.style.cursor = 'grabbing';

			const clientX = e.clientX || e.changedTouches[0].clientX;
			pos.left = this.slider.scrollLeft;
			pos.x = clientX;
			
			document.addEventListener('touchmove', moveHandler);
			document.addEventListener('touchend', upHandler);
			document.addEventListener('mousemove', moveHandler);
			document.addEventListener('mouseup', upHandler);
		};

		const moveHandler = e => {
			let clientX = e.clientX || e.changedTouches[0].clientX
			const dx = clientX - pos.x;
			this.slider.scrollLeft = pos.left - dx;
		};

		const upHandler = () => {
			this.slider.style.cursor = 'grab';

			this.setActiveSlide();
			this.scrollToTheSlide();
			this._isHandleUp = true;

			document.removeEventListener('touchmove', moveHandler);
			document.removeEventListener('touchend', upHandler);
			document.removeEventListener('mousemove', moveHandler);
			document.removeEventListener('mouseup', upHandler);
		};

		this.slider.addEventListener('mousedown', endHandler);
		this.slider.addEventListener('touchstart', endHandler);
	}

	onScroll() {
		let timer = null;

		this.slider.addEventListener("scroll", e => {
			clearTimeout(timer);

			timer = setTimeout(() => {
				let shouldScrollToTheSlide = true;
				this.removeActiveClassFromAllSlides();

				for (let i = 0; i < this.slides.length; i++) {
					if (
						this.slides[i].getBoundingClientRect().left === this.wrapper.getBoundingClientRect().left ||
						this.slides[i].getBoundingClientRect().right === this.wrapper.getBoundingClientRect().right
					) {
						this.slides[i].classList.add("active");
						this.activeIndex = i;
						shouldScrollToTheSlide = false;

						break;
					}
				}

				if (shouldScrollToTheSlide && this._isHandleUp) {
					this.setActiveSlide();
					this.scrollToTheSlide();
				}

				this._isHandleUp = false;
			}, 100);
		})
	}

	//UTILS
	scrollToTheSlide() {
		const slide = this.slides[this.activeIndex];
		this.removeActiveClassFromAllSlides();
		slide.classList.add("active");
		slide.scrollIntoView({ behavior: "smooth", inline: "start" });
	}
	
	setActiveSlide() {
		const slideWidth = this.slides[0].getBoundingClientRect().width;;
		this.activeIndex = Math.round(this.slider.scrollLeft / slideWidth);
	}

	removeActiveClassFromAllSlides() {
		[...this.slides].forEach(value => value.classList.remove("active"));
	}
}
