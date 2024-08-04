import { EditableElement } from "./editable-element.js";

export class Select extends EditableElement {
    #options;
    #defaultValue;
    #updateProperty;

    constructor({ elementId, updateProperty, parentElement, options, additionalClasses = "", displayProperty = "", defaultValue = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty }, itemId);
        this.#options = options;
        this.#defaultValue = defaultValue;
        this.#updateProperty = updateProperty;
        this.#render();
    }

    #render() {
        const optionsHTML = this.#options.map(option =>
            `<option value="${option}" ${option === this.#defaultValue ? 'selected' : ''}>${option}</option>`
        ).join('');

        const newSelectHTML = `
            <div class="flex-fill ${this.getAdditionalClasses()}">
                <h3>${this.getFormattedDisplayProperty(this.getDisplayProperty())}</h3>
                <select class="editable-box form-select" id="${this.getElementId()}">
                    ${optionsHTML}
                </select>
            </div>
        `;
        this.appendHtml(newSelectHTML);
        this.setElement($(`#${this.getElementId()}`));

        if (this.#updateProperty) {
            this.getElement().on("change", (event) => this.updateInput(event, this.#updateProperty, "string"));
        }
    }

    getValue() {
        return this.getElement().val();
    }
}
