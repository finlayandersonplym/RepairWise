import { CheckBox } from "./checkBox.js";

export class CheckBoxGroup {
    constructor({
        groupId,
        parentElement,
        additionalClasses = "",
    }, itemId) {
        this.groupId = groupId.replace(/^#/, '');
        this.parentElement = parentElement;
        this.additionalClasses = additionalClasses;
        this.itemId = itemId;
        this.$element = null;
        this.checkBoxes = [];
        this.render();
    }

    addCheckBox(options) {
        options.parentElement = `#${this.groupId}`;
        const checkBox = new CheckBox(options, this.itemId);
        this.checkBoxes.push(checkBox);
        return checkBox;
    }

    render() {
        const newGroupHTML = `<div id="${this.groupId}" class="${this.additionalClasses}"></div>`;
        $(this.parentElement).append(newGroupHTML);

        this.$element = $(`#${this.elementId}`); 
    }
}
