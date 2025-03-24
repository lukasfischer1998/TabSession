export function loadSessions() {
	const sessionsList = document.getElementById("sessionsList");

	if (!sessionsList) {
		console.error("Error: sessionList not found.");
		return;
	}

	chrome.storage.local.get(["sessions"], function (result) {
		const sessions = result.sessions || {};
		sessionsList.innerHTML = "";

		if (Object.keys(sessions).length === 0) {
			return;
		}

		for (const [name, sessionData] of Object.entries(sessions)) {
			const li = document.createElement("li");
			li.classList.add("popup__session-item");

			const sessionInfoContainer = document.createElement("div");
			sessionInfoContainer.classList.add("popup__session-info-container");

			const sessionName = document.createElement("span");
			sessionName.classList.add("popup__session-name");
			sessionName.textContent = name;
			sessionName.setAttribute("contenteditable", "true");
            sessionName.setAttribute("spellcheck", "false");

			const sessionTabs = document.createElement("span");
			sessionTabs.classList.add("popup__session-tabs");
			sessionTabs.textContent = ` (${sessionData.count} Tabs)`;

			sessionInfoContainer.appendChild(sessionName);
			sessionInfoContainer.appendChild(sessionTabs);

			const buttonContainer = document.createElement("div");
			buttonContainer.classList.add("popup__button-container");

			// Öffnen-Button
			const restoreButton = document.createElement("button");
			restoreButton.classList.add("popup__button", "popup__button--open");
			restoreButton.innerHTML = `<img src="../icons/openIcon.svg" alt="Open">`;
			restoreButton.addEventListener("click", () =>
				restoreSession(sessionData.urls)
			);

			// Umbenennen-Button
			const renameButton = document.createElement("button");
			renameButton.classList.add(
				"popup__button",
				"popup__button--rename"
			);
			renameButton.innerHTML = `<img src="../icons/renameIcon.svg" alt="Rename">`;
			renameButton.addEventListener("click", () => {
				sessionName.focus(); // Fokus auf das contenteditable-Feld setzen
			});

			// Löschen-Button
			const deleteButton = document.createElement("button");
			deleteButton.classList.add(
				"popup__button",
				"popup__button--delete"
			);
			deleteButton.innerHTML = `<img src="../icons/deleteIcon.svg" alt="Delete">`;
			deleteButton.addEventListener("click", () => deleteSession(name));

			buttonContainer.appendChild(restoreButton);
			buttonContainer.appendChild(renameButton);
			buttonContainer.appendChild(deleteButton);

			li.appendChild(sessionInfoContainer);
			li.appendChild(buttonContainer);
			sessionsList.appendChild(li);

			// Event-Listener für die Enter-Taste
			sessionName.addEventListener("keydown", function (event) {
				if (event.key === "Enter") {
					event.preventDefault();
					sessionName.blur();
				}
			});

			sessionName.addEventListener("blur", function () {
				const newName = sessionName.textContent.trim();
				const feedbackRename =
					document.getElementById("feedback_rename");

				if (!newName) {
					feedbackRename.classList.add("popup__feedback--visible");
					sessionName.focus();
					return;
				}

				feedbackRename.classList.remove("popup__feedback--visible");

				updateSessionName(name, newName);
			});
		}
	});
}

function updateSessionName(oldName, newName) {
	const feedbackRename = document.getElementById("feedback_rename");
	if (!newName.trim()) {
		feedbackRename.classList.add("popup__feedback--visible");
		return;
	}

	if (oldName === newName) {
		return;
	}

	chrome.storage.local.get(["sessions"], function (result) {
		const sessions = result.sessions || {};

		if (sessions[oldName]) {
			sessions[newName] = sessions[oldName];
			delete sessions[oldName];
			chrome.storage.local.set({ sessions: sessions }, function () {
				loadSessions();
			});
		}
	});
}

export function restoreSession(urls) {
	urls.forEach((url) => {
		chrome.tabs.create({ url: url });
	});
}

export function deleteSession(sessionName) {
	chrome.storage.local.get(["sessions"], function (result) {
		const sessions = result.sessions || {};
		delete sessions[sessionName];
		chrome.storage.local.set({ sessions: sessions }, function () {
			loadSessions();
		});
	});
}
