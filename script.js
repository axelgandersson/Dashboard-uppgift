import config from "./config";
console.log(config);

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

	const textarea = document.createElement("textarea");
	textarea.id = "user-notes";
	textarea.placeholder = "Write your notes here...";

	// Load saved notes from localStorage
	const savedNotes = localStorage.getItem("userNotes") || "";
	textarea.value = savedNotes;

	// Save notes automatically when user types
	textarea.addEventListener("input", () => {
		localStorage.setItem("userNotes", textarea.value);
	});

	notesDiv.appendChild(textarea);
}

async function weatherApi() {
	try {
		const response = await fetch();
		if (!response.ok) {
			throw new Error("error");
		}
		const items = await response.json();
		const weatherDiv = document.getElementById("weather-widget");
		const currentHour = new Date().getHours();

		const temp = items.hourly.temperature_2m[currentHour];
		const visibility = items.hourly.visibility[currentHour];
		const dewPoint = items.hourly.dew_point_2m[currentHour];

		weatherDiv.innerHTML = `
			<h3>Current Weather</h3>
			<p>Temperature: ${temp}°C</p>
			<p>Visibility: ${visibility}m</p>
			<p>Dew Point: ${dewPoint}°C</p>
		`;
	} catch (error) {
		console.log("error", error.message);
	}
}
weatherApi();
clockGen();
h1Change();
createNotes();
