import { updateInput } from "../localstorage-utils.js";

export class LiveEditableText {
    constructor({
        elementId,
        updateProperty,
        parentElement,
        defaultText = "",
        additionalClasses = ""
    }, itemId) {
        this.elementId = elementId.replace(/^#/, '');
        this.updateProperty = updateProperty;
        this.parentElement = parentElement;
        this.defaultText = defaultText;
        this.additionalClasses = additionalClasses;
        this.itemId = itemId;
        this.$element = null;
        this.render();
    }

    render() {
        const newEditableTextHTML = `
        <div class="flex-fill">
            <div id="${this.elementId}" class="editable-text ${this.additionalClasses}">${this.defaultText}</div>
        </div>
        `;

        $(this.parentElement).append(newEditableTextHTML);

        this.$element = $(`#${this.elementId}`); 

        // Attach event listeners
        this.$element.on("input", (event) => updateInput(event, this.updateProperty, this.itemId));
        this.$element.on("click", this.handleEditableTextClick);
        this.$element.on("keypress", this.handleEnterKey);
        this.$element.on("paste", this.handlePaste);
        this.$element.on("blur", this.handleBlur);
    }

    handleEditableTextClick(event) {
        const $element = $(event.currentTarget);
        $element.attr("contenteditable", "true").addClass("active-editable").focus();
    }

    handleEnterKey(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $(event.currentTarget).blur();
        }
    }

    handlePaste(event) {
        event.preventDefault();
        const clipboardData = (event.originalEvent || event).clipboardData;
        const pastedData = clipboardData.getData("text/plain");
        const cleanedData = $("<div>").text(pastedData).html();
        document.execCommand("insertText", false, cleanedData);
    }

    handleBlur(event) {
        const $element = $(event.currentTarget);
        $element.attr("contenteditable", "false")
            .removeClass("active-editable editable-text")
            .addClass("edited-text");
    }

    getElement() {
        return this.$element;
    }
}
