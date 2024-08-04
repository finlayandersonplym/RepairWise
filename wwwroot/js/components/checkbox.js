import { EditableElement } from "./editable-element.js";

export class CheckBox extends EditableElement {
    #label;
    #checked;

    constructor({ elementId, parentElement, label = "", checked = false, additionalClasses = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty: label }, itemId);
        this.#label = label;
        this.#checked = checked;
        this.#render();
    }

    #render() {
        const newCheckBoxHTML = `
            <div class="form-check ${this.getAdditionalClasses()}">
                <input class="form-check-input" type="checkbox" id="${this.getElementId()}" ${this.#checked ? "checked" : ""}>
                <label class="form-check-label" for="${this.getElementId()}">
                    ${this.#label}
                </label>
            </div>
        `;
        this.appendHtml(newCheckBoxHTML);
        this.setElement($(`#${this.getElementId()}`));
    }

    getValue() {
        return this.getElement().is(":checked");
    }
}
