import { loadSessions } from "./SessionList.js";

export function setupSaveSessionForm() {
	const saveSessionButton = document.getElementById("saveSession");
	const sessionNameInput = document.getElementById("sessionName");
	const feedback = document.getElementById("feedback");

	if (!saveSessionButton || !sessionNameInput || !feedback) {
		console.error("Fehler: DOM-Elemente nicht gefunden.");
		return;
	}

	saveSessionButton.addEventListener("click", saveSession);
	sessionNameInput.addEventListener("input", function () {
		feedback.classList.remove("popup__feedback--visible");
	});

	sessionNameInput.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			saveSession();
		}
	});

	function saveSession() {
		const sessionName = sessionNameInput.value;

		if (!sessionName) {
			feedback.classList.add("popup__feedback--visible");
			return;
		}

		chrome.tabs.query({ currentWindow: true }, function (tabs) {
			if (chrome.runtime.lastError) {
				console.error(
					"Fehler beim Abrufen der Tabs:",
					chrome.runtime.lastError
				);
				return;
			}

			const tabUrls = tabs.map((tab) => tab.url);
			const tabCount = tabs.length;

			chrome.storage.local.get(["sessions"], function (result) {
				const sessions = result.sessions || {};
				sessions[sessionName] = {
					urls: tabUrls,
					count: tabCount,
				};
				chrome.storage.local.set({ sessions: sessions }, function () {
					loadSessions();
					sessionNameInput.value = "";
				});
			});
		});
	}
}
