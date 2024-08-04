import { EditableElement } from "./editable-element.js";
import { CheckBox } from "./checkBox.js";

export class CheckBoxGroup extends EditableElement {
    #checkBoxes;

    constructor({ groupId, parentElement, additionalClasses = "" }, itemId) {
        super({ elementId: groupId, parentElement, additionalClasses }, itemId);
        this.#checkBoxes = [];
        this.#render();
    }

    addCheckBox(options) {
        options.parentElement = `#${this.getElementId()}`;
        const checkBox = new CheckBox(options, this.getItemId());
        this.#checkBoxes.push(checkBox);
        return checkBox;
    }

    #render() {
        const newGroupHTML = `<div id="${this.getElementId()}" class="${this.getAdditionalClasses()}"></div>`;
        this.appendHtml(newGroupHTML);
    }
}
