let homeColumnsInput = document.getElementById("home-columns");
let clearButton = document.getElementById("clear");

browser.storage.local
    .get(["homeColumns"])
    .then((v) => (homeColumnsInput.value = v["homeColumns"]));

homeColumnsInput.addEventListener("input", (ev) => {
    browser.storage.local.set({ homeColumns: ev.data });
});

clearButton.addEventListener("click", () => {
    homeColumnsInput.value = null;
    browser.storage.local.set({ homeColumns: null });
});
