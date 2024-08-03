import { updateInput } from "../localstorage-utils.js";

export class TextBox {
    constructor({
        elementId,
        updateProperty,
        parentElement,
        additionalClasses = "",
        inputType = "text",
        defaultText = "",
        displayProperty = ""
    }, itemId) {
        this.elementId = elementId.replace(/^#/, '');
        this.updateProperty = updateProperty;
        this.parentElement = parentElement;
        this.additionalClasses = additionalClasses;
        this.inputType = inputType;
        this.defaultText = defaultText;
        this.displayProperty = displayProperty || this.formatDisplayProperty(updateProperty);
        this.itemId = itemId;
        this.$element = null;
        this.render();
    }

    formatDisplayProperty(property) {
        return property
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => this.capitalizeFirstLetter(word))
            .join(' ');
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const newTextBoxHTML = `
            <div class="flex-fill ${this.additionalClasses}">
                <h3>${this.displayProperty}</h3>
                <div class="text-box editable-box" id="${this.elementId}" contenteditable="true" data-placeholder="Enter ${this.displayProperty}">${this.defaultText}</div>
            </div>
        `;
        $(this.parentElement).append(newTextBoxHTML);
        this.$element = $(`#${this.elementId}`); // Assign jQuery object to this.$element

        if (this.updateProperty) {
            this.$element.on("input", (event) => updateInput(event, this.updateProperty, this.itemId, this.inputType));
        }
    }

    getElement() {
        return this.$element;
    }

    getValue() {
        return this.$element.text().trim();
    }
}
