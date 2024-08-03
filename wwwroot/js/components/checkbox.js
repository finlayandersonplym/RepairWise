
export class CheckBox {
    constructor({
        elementId,
        parentElement,
        label = "",
        checked = false,
        additionalClasses = ""
    }, itemId) {
        this.elementId = elementId.replace(/^#/, '');
        this.parentElement = parentElement;
        this.label = label;
        this.checked = checked;
        this.additionalClasses = additionalClasses;
        this.itemId = itemId;
        this.$element = null;
        this.render();
    }

    render() {
        const newCheckBoxHTML = `
            <div class="form-check ${this.additionalClasses}">
                <input class="form-check-input" type="checkbox" id="${this.elementId}" ${this.checked ? "checked" : ""}>
                <label class="form-check-label" for="${this.elementId}">
                    ${this.label}
                </label>
            </div>
        `;
        $(this.parentElement).append(newCheckBoxHTML);
        this.$element = $(`#${this.elementId}`);
    }

    getElement() {
        return this.$element;
    }

    getValue() {
        return this.$element.is(":checked");
    }
}
