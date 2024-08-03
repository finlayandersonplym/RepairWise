import { RadioOption } from "./radio-option.js";

export class RadioOptionGroup {
    constructor({
        groupId,
        parentElement,
        name,
        additionalClasses = "",
    }, itemId) {
        this.groupId = groupId.replace(/^#/, '');
        this.parentElement = parentElement;
        this.name = name;
        this.additionalClasses = additionalClasses;
        this.itemId = itemId;
        this.$element = null;
        this.radioOptions = [];
        this.render();
    }

    addRadioOption(options) {
        options.parentElement = `#${this.groupId}`;
        options.name = this.name;
        const radioOption = new RadioOption(options, this.itemId);
        this.radioOptions.push(radioOption);
    }

    render() {
        const newGroupHTML = `<div id="${this.groupId}" class="${this.additionalClasses}"></div>`;
        $(this.parentElement).append(newGroupHTML);
        this.$element = $(`#${this.elementId}`);
    }

    getElement() {
        return this.$element;
    }

    getValue() {
        for (const option of this.radioOptions) {
            if (option.isChecked()) {
                return option.getValue(); 
            }
        }
        return -1;
    }

}
