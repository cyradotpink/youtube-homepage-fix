// This script is the glue that gives the fix.js page script access
// to our configuration stored in extension storage

const config = {};

function update() {
    window.wrappedJSObject.updateHomepageFixConfig(cloneInto(config, window));
    let override = config.homeColumns;
    if ((override ?? null) === null) {
        override = window.wrappedJSObject.homepageFixData.ytDesiredItemsPerRow;
    }
    if ((override ?? null) === null) {
        return;
    }
    // Immediately update layout on configuration change.
    // Note that the "setProperty" here won't be intercepted by our patch
    // in fix.js because we're accessing the document through Xray vision:
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#xray_vision_in_firefox
    window.document
        .querySelector("[page-subtype=home]>#primary>:first-child")
        ?.style.setProperty("--ytd-rich-grid-items-per-row", override);
}

browser.storage.local.get(["homeColumns"]).then((result) => {
    Object.assign(config, result);
    update();
});

browser.storage.onChanged.addListener((changes, areaName) => {
    for (let item of Object.keys(changes)) {
        config[item] = changes[item].newValue;
    }
    update();
});
