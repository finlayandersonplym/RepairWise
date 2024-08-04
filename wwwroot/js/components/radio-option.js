import { EditableElement } from "./editable-element.js";

export class RadioOption extends EditableElement {
    #name;
    #label;
    #value;
    #checked;

    constructor({ elementId, parentElement, name, label = "", value = "", checked = false, additionalClasses = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty: label }, itemId);
        this.#name = name;
        this.#label = label;
        this.#value = value;
        this.#checked = checked;
        this.#render();
    }

    #render() {
        const newRadioOptionHTML = `
            <div class="form-check ${this.getAdditionalClasses()}">
                <input class="form-check-input" type="radio" name="${this.#name}" id="${this.getElementId()}" ${this.#checked ? "checked" : ""}>
                <label class="form-check-label" for="${this.getElementId()}">
                    ${this.#label}
                </label>
            </div>
        `;
        this.appendHtml(newRadioOptionHTML);
        this.setElement($(`#${this.getElementId()}`));
    }

    getValue() {
        return this.#value;
    }

    isChecked() {
        return this.getElement().is(":checked");
    }
}
