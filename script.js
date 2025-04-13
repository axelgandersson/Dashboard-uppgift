//Clock for the header
function clockGen() {
	const timeNdate = new Date();
	const f = new Intl.DateTimeFormat("en-uk", {
		timeStyle: "short",
		dateStyle: "short",
	});

	const times = f.format(timeNdate);
	const printTime = document.createElement("div");
	printTime.id = "timeID";
	printTime.innerHTML = times;

	const clockDiv = document.getElementById("clock");
	clockDiv.appendChild(printTime);

	setInterval(() => {
		printTime.innerHTML = f.format(new Date());
	}, 1000);
}

//h1 that can change
function h1Change() {
	const nameHeader = document.createElement("h1");
	nameHeader.contentEditable = true;
	nameHeader.id = "editableName";

	// Load saved name from localStorage or use default
	const savedName = localStorage.getItem("userName") || "Example Name";
	nameHeader.textContent = savedName;

	// Save changes when user finishes editing or presses Enter
	nameHeader.addEventListener("blur", () => {
		localStorage.setItem("userName", nameHeader.textContent);
	});

	nameHeader.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault(); // Prevents adding a new line
			nameHeader.blur(); // Triggers the blur event and saves
		}
	});

	// Add to document
	const nameDiv = document.getElementById("name");
	nameDiv.appendChild(nameHeader);
}

// notepad function
function createNotes() {
	const notesDiv = document.getElementById("notes-container");

	// Create container for textarea and button
	const notesContent = document.createElement("div");
	notesContent.className = "notes-content";

	const textarea = document.createElement("textarea");
	textarea.id = "user-notes";
	textarea.placeholder = "Write your notes here...";

	// Create clear button
	const clearButton = document.createElement("button");
	clearButton.id = "clear-notes";
	clearButton.textContent = "Clear Notes";
	clearButton.onclick = () => {
		textarea.value = "";
		localStorage.removeItem("userNotes");
	};

	// Load saved notes from localStorage
	const savedNotes = localStorage.getItem("userNotes") || "";
	textarea.value = savedNotes;

	// Save notes automatically when user types
	textarea.addEventListener("input", () => {
		localStorage.setItem("userNotes", textarea.value);
	});

	notesContent.appendChild(textarea);
	notesContent.appendChild(clearButton);
	notesDiv.appendChild(notesContent);
}

//get location for weatherapi
async function getLocation() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Geolocation is not supported by your browser"));
		}

		navigator.geolocation.getCurrentPosition(
			(position) => resolve(position),
			(error) => reject(error)
		);
	});
}

//weather api data gather
async function weatherApi() {
	try {
		let apikey = localStorage.getItem("weatherApiKey");
		if (!apikey) {
			const div = document.getElementById("weather-widget");
			div.innerHTML = `
                <div class="weather-content">
                    <h2 class="weather-title">Weather Widget Setup</h2>
                    <div class="api-form">
                        <input type="text" id="apiKeyInput" placeholder="Enter your OpenWeatherMap API key">
                        <button onclick="submitApiKey()">Submit</button>
                    </div>
                </div>
            `;
			return null;
		}

		const position = await getLocation();
		const lat = `lat=${position.coords.latitude}`;
		const lon = `&lon=${position.coords.longitude}`;
		const url = `https://api.openweathermap.org/data/2.5/weather?${lat}${lon}&appid=${apikey}`;

		const response = await fetch(url);
		if (!response.ok) {
			// If API key is invalid, remove it from storage and prompt again next time
			if (response.status === 401) {
				localStorage.removeItem("weatherApiKey");
				throw new Error("Invalid API key");
			}
			throw new Error("Weather API error");
		}
		const items = await response.json();
		return items;
	} catch (error) {
		console.log("Error:", error.message);
		const div = document.getElementById("weather-widget");
		div.innerHTML = `
            <div class="weather-content">
                <h2 class="weather-title">Unable to fetch weather</h2>
                <p>${
									error.message === "Invalid API key"
										? "Please refresh the page and enter a valid API key."
										: "Please allow location access to see your local weather."
								}</p>
            </div>
        `;
	}
}

//grab key from user
function submitApiKey() {
	const apikey = document.getElementById("apiKeyInput").value;
	if (apikey) {
		localStorage.setItem("weatherApiKey", apikey);
		buildWeather(); // Rebuild the weather widget with the new API key
	}
}

//render weather data
function buildWeather() {
	weatherApi().then((data) => {
		if (!data) return; // Exit if no data (e.g., API key prompt)

		const div = document.getElementById("weather-widget");
		const tempCelsius = Math.round(data.main.temp - 273.15);

		div.innerHTML = `
            <div class="weather-content">
                <h2 class="weather-title">Weather in ${data.name}</h2>
                <div class="weather-info">
                    <div class="temp-container">
                        <span class="temperature">${tempCelsius}°C</span>
                        <span class="description">${
													data.weather[0].description
												}</span>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/w/${
													data.weather[0].icon
												}.png" alt="weather icon">
                    </div>
                </div>
                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Humidity</span>
                        <span class="value">${data.main.humidity}%</span>
                    </div>
                    <div class="detail">
                        <span class="label">Wind</span>
                        <span class="value">${Math.round(
													data.wind.speed
												)} m/s</span>
                    </div>
                </div>
            </div>
        `;
	});
}

function bookMarks() {
	const container = document.getElementById("linklist");
	let links = document.createElement("div");
	links.id = "links";
	innerHTML = `<h2>Bookmarks</h2>`;
	const linkInput = document.createElement("input");
	linkInput.type = "text";
	linkInput.placeholder = "Enter a URL";
	const addButton = document.createElement("button");
	addButton.innerText = "Add Link";
	addButton.onclick = () => {
		const url = linkInput.value;
		if (url) {
			const linkItem = document.createElement("div");
			linkItem.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
			links.appendChild(linkItem);
			linkInput.value = "";
		}
	};
	container.appendChild(links);
	container.appendChild(linkInput);
	container.appendChild(addButton);
}

async function getBackground() {
	const x = document.getElementById("bgChange");
	const url =
		"https://pixabay.com/api/?key=49724404-63993e20843f7c4952db0c8ff&category=backgrounds&per_page=100";

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.hits && data.hits.length > 0) {
			// Get random image from results
			const randomIndex = Math.floor(Math.random() * data.hits.length);
			const imageUrl = data.hits[randomIndex].largeImageURL;

			// Create and set background image
			document.body.style.backgroundImage = `url(${imageUrl})`;
			document.body.style.backgroundSize = "cover";
			document.body.style.backgroundPosition = "center";
			document.body.style.backgroundRepeat = "no-repeat";

			// Create refresh button if it doesn't exist
			let refreshBtn = document.getElementById("refreshBackground");
			if (!refreshBtn) {
				refreshBtn = document.createElement("button");
				refreshBtn.id = "refreshBackground";
				refreshBtn.innerHTML = "🔄"; // Unicode refresh symbol
				refreshBtn.title = "Change Background";
				refreshBtn.onclick = getBackground;
				document.getElementById("bgChange").appendChild(refreshBtn);
			}
		}
	} catch (error) {
		console.error("Error fetching background:", error);
	}
}

buildWeather();
clockGen();
h1Change();
createNotes();
bookMarks();
getBackground();
