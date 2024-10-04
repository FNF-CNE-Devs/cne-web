function randomizeOrder() {
	var mods = document.querySelectorAll(".featured-mod");
	var parent = mods[0].parentNode;
	var modsArray = Array.from(mods);

	for (var i = modsArray.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = modsArray[i];
		modsArray[i] = modsArray[j];
		modsArray[j] = temp;
	}

	var fragment = document.createDocumentFragment();
	for (var i = 0; i < modsArray.length; i++) {
		fragment.appendChild(modsArray[i].cloneNode(true));
	}
	clearElement(parent);
	parent.appendChild(fragment);
}

function clearElement(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function sortByTime(a, b) {
	var aTime = a.getAttribute("data-time");
	var bTime = b.getAttribute("data-time");

	if (aTime == null) return 1;           // Push null to the bottom
	if (bTime == null) return -1;
	if (aTime === "unreleased") return 1;  // Push "unreleased" to the bottom
	if (bTime === "unreleased") return -1;
	if (aTime === "unknown") return 1;     // Push "unknown" to the bottom
	if (bTime === "unknown") return -1;

	var aDate = new Date(aTime).getTime();
	var bDate = new Date(bTime).getTime();

	if (aDate === bDate) return 0;
	return bDate > aDate ? 1 : -1;
}

function recentOrder() {
	var mods = document.querySelectorAll(".featured-mod");
	var parent = mods[0].parentNode;
	var modsArray = Array.from(mods);

	modsArray.sort(sortByTime);

	var fragment = document.createDocumentFragment();
	for (var i = 0; i < modsArray.length; i++) {
		fragment.appendChild(modsArray[i].cloneNode(true));
	}

	clearElement(parent);
	parent.appendChild(fragment);
}

var sortButtons = document.querySelectorAll(".sort-button");
var orderButtons = document.querySelectorAll(".order-button");
var categoryButtons = document.querySelectorAll(".category-button");
sortButtons.forEach(button => {
	button.addEventListener("click", function(e) {
		e.preventDefault();
		var sort = button.getAttribute("data-sort");
		if(sort == "recent" || sort == "random") {
			if(sort == "random") {
				randomizeOrder();
			} else {
				recentOrder();
			}

			orderButtons.forEach(button => {
				button.classList.remove("selected");
			});
			button.classList.add("selected");
		} else {
			if(sort == "all") {
				document.querySelectorAll(".featured-mod").forEach(mod => {
					if(mod.classList.contains("upcoming")) {
						mod.style.display = "none";
					} else {
						mod.style.display = "block";
					}
				});
			} else {
				document.querySelectorAll(".featured-mod").forEach(mod => {
					mod.style.display = "none";
				});
				document.querySelectorAll(".featured-mod." + sort).forEach(mod => {
					if(sort != "upcoming" && mod.classList.contains("upcoming")) {
						mod.style.display = "none";
					} else {
						mod.style.display = "block";
					}
				});
			}

			categoryButtons.forEach(button => {
				button.classList.remove("selected");
			});
			button.classList.add("selected");
		}
	});
});

randomizeOrder();

function getRelativeTimeString(
	date, // Date | number
	lang = "en" // navigator.language
) {
	const timeMs = typeof date === "number" ? date : date.getTime();
	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
	const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
	const units = ["second", "minute", "hour", "day", "week", "month", "year"];
	const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
	return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

var lastUpdated = document.querySelectorAll(".last-updated");
if(lastUpdated.length > 0 && window.Intl) {
	lastUpdated.forEach(lastUpdated => {
		var time = lastUpdated.getAttribute("data-time");
		if(time != "unknown" && time != null && time != "unreleased") {
			lastUpdated.innerText = getRelativeTimeString(new Date(time));
			lastUpdated.style.display = "inline";
		}
		if(time == "unreleased") {
			lastUpdated.style.display = "inline";
		}
	});
}