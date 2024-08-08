import { EditableElement } from "./editable-element.js";
import { InventoryManager } from "../inventory/item-editor.js";

export class EditItemButton extends EditableElement {
    constructor({ elementId, parentElement, additionalClasses = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty: "Edit" }, itemId);
        this.#render();
    }

    #render() {
        const editButtonHTML = `
            <button id="${this.getElementId()}" class="edit-button ${this.getAdditionalClasses()}">
                Edit
            </button>
        `;
        this.appendHtml(editButtonHTML);
        this.setElement($(`#${this.getElementId()}`));
        this.getElement().on("click", () => {
            const itemManager = new InventoryManager();
            itemManager.loadItemEditor(this.getItemId());
        });
    }
}
