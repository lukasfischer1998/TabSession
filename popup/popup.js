import { setupToggleSwitch } from "./components/Toggleswitch.js";
import { setupSaveSessionForm } from "./components/SaveSessionForm.js";
import { loadSessions as loadSessionList } from "./components/SessionList.js";

setupToggleSwitch();
setupSaveSessionForm();
loadSessionList();

document.addEventListener("DOMContentLoaded", function () {
	const sessionNameInput = document.getElementById("sessionName");
	if (sessionNameInput) {
		sessionNameInput.focus();
	}
});
