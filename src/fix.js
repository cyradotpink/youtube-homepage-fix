// This script is loaded directly into YouTube's execution context

window.homepageFixConfig = {};
window.homepageFixData = {};

// if setPropertyOriginal is already defined, that means the extension was probably reloaded
// and setProperty is already patched. We don't want to do that again.
if (CSSStyleDeclaration.prototype.setPropertyOriginal === undefined) {
    CSSStyleDeclaration.prototype.setPropertyOriginal =
        CSSStyleDeclaration.prototype.setProperty;
}

// Called by content.js
window.updateHomepageFixConfig = function (config) {
    Object.assign(homepageFixConfig, config);
};

// Patch style.setProperty calls to intercept youtube attempting to set the layout
CSSStyleDeclaration.prototype.setProperty = function (...args) {
    if (
        args[0] == "--ytd-rich-grid-items-per-row" &&
        document.querySelector("[page-subtype=home]>#primary")?.children[0]
            ?.style === this
    ) {
        // We save the amount of columns that youtube wants right now so we have the value
        // if the user clears the override later
        homepageFixData.ytDesiredItemsPerRow = args[1];
        let override = homepageFixConfig.homeColumns;
        if (typeof override === "string") {
            console.log(
                `Youtube wants to show ${args[1]} items per row; Showing ${override} instead!`,
            );
            args[1] = override;
        }
    }
    return this.setPropertyOriginal.apply(this, args);
};
