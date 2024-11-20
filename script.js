const wrapper = document.querySelector(".wrapper");
const carouselUl = document.querySelector(".carouselUl");
const firstCardWidth = carouselUl.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carouselUl.children];

let isDragging = false,
	isAutoPlay = true,
	startX,
	startScrollLeft,
	timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carouselUl.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens
	.slice(-cardPerView)
	.reverse()
	.forEach((card) => {
		carouselUl.insertAdjacentHTML("afterbegin", card.outerHTML);
	});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
	carouselUl.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carouselUl.classList.add("no-transition");
carouselUl.scrollLeft = carouselUl.offsetWidth;
carouselUl.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		carouselUl.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
	});
});

const dragStart = (e) => {
	isDragging = true;
	carouselUl.classList.add("dragging");
	// Records the initial cursor and scroll position of the carousel
	startX = e.pageX;
	startScrollLeft = carouselUl.scrollLeft;
};

const dragging = (e) => {
	if (!isDragging) return; // if isDragging is false return from here
	// Updates the scroll position of the carousel based on the cursor movement
	carouselUl.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
	isDragging = false;
	carouselUl.classList.remove("dragging");
};

const infiniteScroll = () => {
	// If the carousel is at the beginning, scroll to the end
	if (carouselUl.scrollLeft === 0) {
		carouselUl.classList.add("no-transition");
		carouselUl.scrollLeft = carouselUl.scrollWidth - 2 * carouselUl.offsetWidth;
		carouselUl.classList.remove("no-transition");
	}
	// If the carousel is at the end, scroll to the beginning
	else if (
		Math.ceil(carouselUl.scrollLeft) ===
		carouselUl.scrollWidth - carouselUl.offsetWidth
	) {
		carouselUl.classList.add("no-transition");
		carouselUl.scrollLeft = carouselUl.offsetWidth;
		carouselUl.classList.remove("no-transition");
	}

	// Clear existing timeout & start autoplay if mouse is not hovering over carousel
	clearTimeout(timeoutId);
	if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
	if (window.innerWidth < 200 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
	// Autoplay the carousel after every 2500 ms
	timeoutId = setTimeout(() => (carouselUl.scrollLeft += firstCardWidth), 3500);
};
autoPlay();

carouselUl.addEventListener("mousedown", dragStart);
carouselUl.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carouselUl.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);







// Инициализация карты
const map = L.map('map').setView([34.0522, -118.2437], 9);

// Добавление слоя карты
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Массив с координатами и описанием меток
const markers = [
    { coords: [34.0317, -118.1433], popup: "LOS ANGELES" },
  { coords: [34.1502, -118.6469], popup: "CALABASOS" },
  { coords: [33.4311, -117.5846], popup: "ORANGE COUNTY" },
  { coords: [34.0310, -118.4897], popup: "SANTA MONICA" },
  { coords: [34.0736, -118.4004], popup: "BEVERLY HILLS" },
  { coords: [34.1057, -118.2622], popup: "SAN FERNANDO VALLEY" }

  
];

// Добавление меток на карту
markers.forEach(marker => {
  L.marker(marker.coords).addTo(map).bindPopup(marker.popup);
});