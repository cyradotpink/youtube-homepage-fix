// This script is loaded directly into YouTube's execution context

window.homepageFixConfig = {};
window.homepageFixData = {};

// if setPropertyOriginal is already defined, that means the extension was probably reloaded
// and setProperty is already patched. We don't want to "save" it again.
if (CSSStyleDeclaration.prototype.setPropertyOriginal === undefined) {
    CSSStyleDeclaration.prototype.setPropertyOriginal =
        CSSStyleDeclaration.prototype.setProperty;
}

// Called by content.js
window.updateHomepageFixConfig = function (config) {
    Object.assign(homepageFixConfig, config);
};

// Patch style.setProperty calls to intercept youtube attempting to set the layout
CSSStyleDeclaration.prototype.setProperty = function (
    property,
    value,
    ...rest // Shouldn't really get a rest but we technically can so let's be clean and pass it on
) {
    if (
        property == "--ytd-rich-grid-items-per-row" &&
        document.querySelector("[page-subtype=home]>#primary>:first-child")
            ?.style === this
    ) {
        // We save the amount of columns that youtube wants right now so we have the value
        // if the user clears the override later
        homepageFixData.ytDesiredItemsPerRow = value;
        let override = homepageFixConfig.homeColumns;
        if ((override ?? null) !== null) {
            console.log(
                `Youtube wants to show ${value} items per row; Showing ${override} instead!`,
            );
            value = override;
        }
    }
    return this.setPropertyOriginal.apply(this, [property, value, ...rest]);
};
