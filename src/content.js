const gridSelector = "[page-subtype=home]>#primary>:first-child";
const config = {};
const data = {};

function setProperty(property, value, ...rest) {
    if (
        property == "--ytd-rich-grid-items-per-row" &&
        document.querySelector(gridSelector)?.style === this
    ) {
        // We save the amount of columns that youtube wants right now so we have the value
        // if the user clears the override later
        data.ytDesiredItemsPerRow = value;
        let override = config.homeColumns ?? null;
        if (override !== null) {
            console.log(
                `Youtube wants to show ${value} items per row; Showing ${override} instead!`,
            );
            value = override;
        }
    }
    // This looks recursive but isn't (because of Xray vision)
    return this.setProperty(property, value, ...rest);
}

let stylePrototype = CSSStyleDeclaration.prototype.wrappedJSObject;
stylePrototype.setProperty = exportFunction(setProperty, stylePrototype);

function update() {
    let override = config.homeColumns ?? data.ytDesiredItemsPerRow ?? null;
    if (override === null) return;
    document
        .querySelector(gridSelector)
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
