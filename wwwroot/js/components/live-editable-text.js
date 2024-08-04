import { EditableElement } from "./editable-element.js";

export class LiveEditableText extends EditableElement {
    #defaultText;
    #updateProperty;

    constructor({ elementId, updateProperty, parentElement, defaultText = "", additionalClasses = "" }, itemId) {
        super({ elementId, parentElement, additionalClasses, displayProperty: "" }, itemId);
        this.#defaultText = defaultText;
        this.#updateProperty = updateProperty;
        this.#render();
    }

    #render() {
        const newEditableTextHTML = `
        <div class="flex-fill">
            <div id="${this.getElementId()}" class="editable-text ${this.getAdditionalClasses()}">${this.#defaultText}</div>
        </div>
        `;
        this.appendHtml(newEditableTextHTML);
        this.#attachEventListeners();
    }

    #attachEventListeners() {
        const $element = this.getElement();
        $element.on("input", (event) => this.updateInput(event, this.#updateProperty, "text"));
        $element.on("click", this.#handleEditableTextClick);
        $element.on("keypress", this.#handleEnterKey);
        $element.on("paste", this.#handlePaste);
        $element.on("blur", this.#handleBlur);
    }

    #handleEditableTextClick(event) {
        const $element = $(event.currentTarget);
        $element.attr("contenteditable", "true").addClass("active-editable").focus();
    }

    #handleEnterKey(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $(event.currentTarget).blur();
        }
    }

    #handlePaste(event) {
        event.preventDefault();
        const clipboardData = (event.originalEvent || event).clipboardData;
        const pastedData = clipboardData.getData("text/plain");
        const cleanedData = $("<div>").text(pastedData).html();
        document.execCommand("insertText", false, cleanedData);
    }

    #handleBlur(event) {
        const $element = $(event.currentTarget);
        $element.attr("contenteditable", "false")
            .removeClass("active-editable editable-text")
            .addClass("edited-text");
    }
}
