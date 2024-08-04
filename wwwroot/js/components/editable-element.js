import { LocalStorageManager } from "../localstorage-utils.js";

class EditableElement {
    #elementId;
    #parentElement;
    #additionalClasses;
    #displayProperty;
    #itemId;
    #$element;
    #localStorageManager;

    constructor({
        elementId,
        parentElement,
        additionalClasses = "",
        displayProperty = ""
    }, itemId) {
        this.#elementId = elementId.replace(/^#/, '');
        this.#parentElement = parentElement;
        this.#additionalClasses = additionalClasses;
        this.#displayProperty = displayProperty;
        this.#itemId = itemId;
        this.#$element = null;
        this.#localStorageManager = new LocalStorageManager();
    }

    getElementId() {
        return this.#elementId;
    }

    getParentElement() {
        return this.#parentElement;
    }

    getAdditionalClasses() {
        return this.#additionalClasses;
    }

    getDisplayProperty() {
        return this.#displayProperty;
    }

    getItemId() {
        return this.#itemId;
    }

    getElement() {
        return this.#$element;
    }

    setElement($element) {
        this.#$element = $element;
    }

    getFormattedDisplayProperty(property) {
        return this.#formatDisplayProperty(property);
    }

    #formatDisplayProperty(property) {
        return property
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => this.#capitalizeFirstLetter(word))
            .join(' ');
    }

    #capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    appendHtml(html) {
        $(this.getParentElement()).append(html);
        this.setElement($(`#${this.getElementId()}`));
    }

    updateInput(event, updateProperty, inputType) {
        this.#localStorageManager.updateInput(event, updateProperty, this.getItemId(), inputType);
    }
}

export { EditableElement };
