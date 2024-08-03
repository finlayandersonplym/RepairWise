import { updateInput } from "../localstorage-utils.js";

export class Select {
    constructor({
        elementId,
        updateProperty,
        parentElement,
        options,
        additionalClasses = "",
        displayProperty = "",
        defaultValue = "",
    }, itemId) {
        this.elementId = elementId.replace(/^#/, '');
        this.updateProperty = updateProperty;
        this.parentElement = parentElement;
        this.options = options;
        this.additionalClasses = additionalClasses;
        this.displayProperty = displayProperty || this.formatDisplayProperty(updateProperty);
        this.defaultValue = defaultValue,
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
        const optionsHTML = this.options.map(option =>
            `<option value="${option}" ${option === this.defaultValue ? 'selected' : ''}>${option}</option>`
        ).join('');

        const newSelectHTML = `
            <div class="flex-fill ${this.additionalClasses}">
                <h3>${this.displayProperty}</h3>
                <select class="editable-box form-select" id="${this.elementId}">
                    ${optionsHTML}
                </select>
            </div>
        `;
        $(this.parentElement).append(newSelectHTML);

        this.$element = $(`#${this.elementId}`); 

        if (this.updateProperty) {
            this.$element.on("change", (event) => updateInput(event, this.updateProperty, this.itemId));
        }
    }

    getElement() {
        return this.$element;
    }

    getValue() {
        return this.$element.val();
    }
}
