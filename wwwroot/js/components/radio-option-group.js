import { RadioOption } from "./radio-option.js";
import { EditableElement } from "./editable-element.js";

export class RadioOptionGroup extends EditableElement {
    #name;
    #radioOptions;

    constructor({ groupId, parentElement, name, additionalClasses = "" }, itemId) {
        super({ elementId: groupId, parentElement, additionalClasses }, itemId);
        this.#name = name;
        this.#radioOptions = [];
        this.#render();
    }

    addRadioOption(options) {
        options.parentElement = `#${this.getElementId()}`;
        options.name = this.#name;
        const radioOption = new RadioOption(options, this.getItemId());
        this.#radioOptions.push(radioOption);
    }

    #render() {
        const newGroupHTML = `<div id="${this.getElementId()}" class="${this.getAdditionalClasses()}"></div>`;
        this.appendHtml(newGroupHTML);
    }

    getValue() {
        for (const option of this.#radioOptions) {
            if (option.isChecked()) {
                return option.getValue();
            }
        }
        return -1;
    }
}
