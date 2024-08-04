import { EditableElement } from "./editable-element.js";

export class Label extends EditableElement {
    #label;

    constructor({ elementId, parentElement, label = "", additionalClasses = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty: label }, itemId);
        this.#label = label;
        this.#render();
    }

    #render() {
        const newLabelHTML = `
            <div class="${this.getAdditionalClasses()}">
                <h3>${this.#label}</h3>
            </div>
        `;
        this.appendHtml(newLabelHTML);
        this.setElement($(`#${this.getElementId()}`));
    }
}
