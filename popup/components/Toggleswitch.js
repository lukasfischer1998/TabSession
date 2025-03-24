export function setupToggleSwitch() {
	const toggle = document.querySelector(".toggle");
	const body = document.querySelector(".popup");
	const knob = document.querySelector(".knob");
	const icon = document.querySelector(".icon");

	if (!toggle || !body || !knob || !icon) {
		console.error(
			"Error: DOM elements for toggle switch not found."
		);
		return;
	}

	chrome.storage.local.get(["theme"], function (result) {
		let theme = result.theme;

		if (!theme) {
			const isSystemDarkMode = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			theme = isSystemDarkMode ? "dark" : "light";
			chrome.storage.local.set({ theme: theme });
		}

		// Change to Theme
		if (theme === "dark") {
			body.classList.add("popup--dark");
			toggle.classList.add("toggle--active");
			knob.classList.add("knob--active");
			icon.classList.remove("fa-sun");
			icon.classList.add("fa-moon");
		} else {
			body.classList.remove("popup--dark");
			toggle.classList.remove("toggle--active");
			knob.classList.remove("knob--active");
			icon.classList.remove("fa-moon");
			icon.classList.add("fa-sun");
		}
	});

	// Event-Listener for Toggle-Switch
	toggle.addEventListener("click", () => {
		toggle.classList.toggle("toggle--active");
		knob.classList.toggle("knob--active");
		body.classList.toggle("popup--dark");

		const isDarkMode = body.classList.contains("popup--dark");
		icon.classList.toggle("fa-sun", !isDarkMode);
		icon.classList.toggle("fa-moon", isDarkMode);

		chrome.storage.local.set({ theme: isDarkMode ? "dark" : "light" });
	});
}
