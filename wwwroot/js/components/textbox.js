import { EditableElement } from "./editable-element.js";

export class TextBox extends EditableElement {
    #defaultText;
    #inputType;
    #updateProperty;

    constructor({ elementId, updateProperty, parentElement, additionalClasses = "", inputType = "text", defaultText = "", displayProperty = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty }, itemId);
        this.#defaultText = defaultText;
        this.#inputType = inputType;
        this.#updateProperty = updateProperty;
        this.#render();
    }

    #render() {
        const newTextBoxHTML = `
            <div class="flex-fill ${this.getAdditionalClasses()}">
                <h3>${this.getFormattedDisplayProperty(this.getDisplayProperty())}</h3>
                <div class="text-box editable-box" id="${this.getElementId()}" contenteditable="true" data-placeholder="Enter ${this.getDisplayProperty()}">${this.#defaultText}</div>
            </div>
        `;
        this.appendHtml(newTextBoxHTML);
        this.setElement($(`#${this.getElementId()}`));

        if (this.#updateProperty) {
            this.getElement().on("input", (event) => this.updateInput(event, this.#updateProperty, this.#inputType));
        }
    }

    getValue() {
        return this.getElement().text().trim();
    }
}
