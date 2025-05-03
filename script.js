'use strict'

const cards = document.querySelectorAll('.dashboard__cat');
const buttons = document.querySelectorAll('.dashboard__button');
let timeframe;
let cachedData = null;

init();

function init() {
	updateDashboard("weekly")

	buttons.forEach(button => {
		button.addEventListener('click', buttonClickListener);
	})
}


function buttonClickListener(e) {
	/* Set the current button as selected */
	const selectedButton = document.querySelector('.dashboard__button.selected');
	if (selectedButton) selectedButton.classList.remove('selected');
	e.currentTarget.classList.add('selected');

	/* From the object, we get the current timeframe according to the button */
	timeframe = e.currentTarget.dataset.timeframe;

	/* Update dashboard */
	updateDashboard(timeframe);
}

/*fetch function to get data from JSON file */
function updateDashboard(timeframe) {
	if (cachedData) {
		fillData(cachedData, timeframe);
		return;
	}

	fetch('data.json')
		.then((response) => {
			if(!response.ok) throw new Error('Incorrect network response');
			return response.json();
		})
		.then((data) => {
			cachedData = data;
			fillData(data, timeframe)
		})
		.catch((error) => {
			console.error('Fetch error:', error);
		})
}

/* Function to update the data */
function fillData(data, timeframe) {
	cards.forEach((card) => {
		const currentObj = data.find((obj) => obj.title === card.dataset.category);

		if (!currentObj) {
			console.warn(`No data found for category: ${card.dataset.category}`);
			return;
		}

		const { timeframes: {[timeframe]: {current, previous}}} = currentObj;
		card.querySelector(".current").textContent = current;
		card.querySelector(".previous").textContent = previous;
	})
}

