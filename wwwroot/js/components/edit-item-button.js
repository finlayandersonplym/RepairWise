import { loadItemEditor } from "../inventory/item-editor.js";

export class EditItemButton {
    constructor({ elementId, parentElement, additionalClasses = "" }, itemId) {
        this.elementId = elementId.replace(/^#/, '');
        this.parentElement = parentElement;
        this.additionalClasses = additionalClasses;
        this.itemId = itemId;
        this.$element = null;
        this.render();
    }

    render() {
        // Create the HTML for the edit button
        const editButtonHTML = `
            <button id="${this.elementId}" class="edit-button ${this.additionalClasses}">
                Edit
            </button>
        `;

        // Append the button to the parent element
        $(this.parentElement).append(editButtonHTML);

        this.$element = $(`#${this.elementId}`); // Assign jQuery object to this.$element

        // Attach click event listener
        this.$element.on("click", () => loadItemEditor(this.itemId));
    }

    // Method to return the jQuery element
    getElement() {
        return this.$element;
    }
}
