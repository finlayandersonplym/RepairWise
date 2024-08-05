import { EditableElement } from "./editable-element.js";

export class DeleteItemButton extends EditableElement {
    #itemId;
    #tableManager;

    constructor({ elementId, parentElement, additionalClasses = "" }, itemId, tableManager) {
        super({ elementId, parentElement, additionalClasses, displayProperty: "" }, itemId);
        this.#itemId = itemId;
        this.#tableManager = tableManager;
        this.#render();
    }

    #render() {
        const deleteButtonHTML = `
            <button id="${this.getElementId()}" class="btn ${this.getAdditionalClasses()}">
                Delete
            </button>
        `;
        this.appendHtml(deleteButtonHTML);
        this.#attachEventListeners();
    }

    #attachEventListeners() {
        this.getElement().on("click", () => this.#handleDelete());
    }

    #handleDelete() {
        if (confirm("Are you sure you want to delete this item?")) {
            this.deleteItem();
            $("#selection-loader").empty();
            this.#tableManager.populateTable();
        }
    }
}
