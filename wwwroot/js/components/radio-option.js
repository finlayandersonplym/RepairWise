export class RadioOption {
    constructor({
        elementId,
        parentElement,
        name,
        label = "",
        value = "",
        checked = false,
        additionalClasses = "",
    }, itemId) {
        this.elementId = elementId.replace(/^#/, '');
        this.parentElement = parentElement;
        this.name = name;
        this.label = label;
        this.value = value;
        this.checked = checked;
        this.additionalClasses = additionalClasses;
        this.itemId = itemId;
        this.$element = null;
        this.render();
    }

    render() {
        const newRadioOptionHTML = `
            <div class="form-check ${this.additionalClasses}">
                <input class="form-check-input" type="radio" name="${this.name}" id="${this.elementId}" ${this.checked ? "checked" : ""}>
                <label class="form-check-label" for="${this.elementId}">
                    ${this.label}
                </label>
            </div>
        `;
        $(this.parentElement).append(newRadioOptionHTML);
        this.$element = $(`#${this.elementId}`);
    }

    getElement() {
        return this.$element;
    }

    getValue() {
        return this.value;
    }

    isChecked() {
        return this.$element.is(":checked");
    }
}
