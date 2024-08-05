import { EditableElement } from "./editable-element.js";

export class Autocomplete extends EditableElement {
    #updateProperty;

    constructor({ elementId, updateProperty, parentElement, additionalClasses = "", displayProperty = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty }, itemId);
        this.#updateProperty = updateProperty;
        this.#render();
    }

    #render() {
        const newAutocompleteHTML = `
            <div class="autocomplete ${this.getAdditionalClasses()}">
                <h3>${this.getFormattedDisplayProperty(this.getDisplayProperty())}</h3>
               <div class="text-box editable-box" id="${this.getElementId()}" contenteditable="true" data-placeholder="Enter ${this.getDisplayProperty()}"></div>
            </div>
        `;
        this.appendHtml(newAutocompleteHTML);
        this.setElement($(`#${this.getElementId()}`));

        this.#initializeAutocomplete();

        if (this.#updateProperty) {
            this.getElement().on("input", (event) => this.updateInput(event, this.#updateProperty, "string"));
        }
    }

    #initializeAutocomplete() {
        const component = this.getElement();
        let tagsSet = new Set();

        // Retrieve the items array from local storage
        let items = this.getLocalStorageManager().getJsonItems("itemList");

        // Loop through the items to extract each unique value for the specified this.#updateProperty
        items.forEach(item => {
            if (item[this.#updateProperty]) {
                tagsSet.add(item[this.#updateProperty]);
            }
        });

        // Convert the set back to an array
        const tags = Array.from(tagsSet);

        // Initialize jQuery UI autocomplete with the collected tags
        component.autocomplete({
            source: tags
        });

        // Event listener for when an item is selected from the autocomplete suggestions
        component.on("autocompleteselect", (event, ui) => {
            if (this.#updateProperty) {
                component.text(ui.item.value);
                this.updateInput(event, this.#updateProperty, "string");
            }
        });
    }
}