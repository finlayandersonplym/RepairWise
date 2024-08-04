import { EditableElement } from "./editable-element.js";

export class TextField extends EditableElement {
    #property;
    #item;
    #withLabel;

    constructor({ elementId, property, parentElement, item, withLabel = true, additionalClasses = "" }) {
        super({ elementId, parentElement, additionalClasses, displayProperty: property }, item.id);
        this.#property = property;
        this.#item = item;
        this.#withLabel = withLabel;
        this.#render();
    }

    #render() {
        const newFieldHTML = `
        <div class="${this.getAdditionalClasses()}">
            ${this.#withLabel ? `<span class="property-label">${this.getFormattedDisplayProperty(this.#property)}</span>` : ''}
            <span id="${this.getElementId()}">${this.#item[this.#property]}</span>
        </div>
        `;
        this.appendHtml(newFieldHTML);
        this.setElement($(`#${this.getElementId()}`));
    }
}
