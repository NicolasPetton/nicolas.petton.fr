const today = () => {
    var date = new Date();
    return date.toLocaleDateString("en-US", { weekday: 'long' });
};

const inject_today = () => {
	document.querySelectorAll(".today").forEach(el => el.textContent = today());
};

document.addEventListener("DOMContentLoaded", inject_today);
