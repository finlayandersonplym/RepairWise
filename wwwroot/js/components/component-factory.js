// Although having components in seperate functions increases code reuse, it makes it far easier to read and understand, I am not a big fan on huge files and I don't like importing too many functions as it makes it really hard to follow code -
// it's important to avoid circular depdendencies on a project like this

import { TextBox } from "./textBox.js";
import { Select } from "./select.js";
import { LiveEditableText } from "./live-editable-text.js";
import { EditItemButton } from "./edit-item-button.js";
import { DeleteItemButton } from "./delete-item-button.js";
import { TextField } from "./text-field.js";
import { CheckBox } from "./checkbox.js";
import { CheckBoxGroup } from "./checkbox-group.js";
import { Label } from "./label.js";
import { RadioOption } from "./radio-option.js";
import { RadioOptionGroup } from "./radio-option-group.js";
import { Autocomplete } from "./autocomplete.js";

export class ComponentFactory {
    constructor(id) {
        this.itemId = id;
    }

    createTextBox(options) {
        return new TextBox(options, this.itemId);
    }

    createSelect(options) {
        return new Select(options, this.itemId);
    }

    createLiveEditableText(options) {
        return new LiveEditableText(options, this.itemId);
    }

    createCheckBox(options) {
        return new CheckBox(options, this.itemId);
    }

    createCheckBoxGroup(options) {
        return new CheckBoxGroup(options, this.itemId);
    }

    createEditItemButton(options) {
        return new EditItemButton(options, this.itemId);
    }

    createDeleteItemButton(options, tableManager) {
        return new DeleteItemButton(options, this.itemId, tableManager);
    }

    addTextField(options) {
        return new TextField(options, this.itemId);
    }

    createLabel(options) {
        return new Label(options, this.itemId);
    }

    createRadioOption(options) {
        return new RadioOption(options, this.itemId);
    }

    createRadioOptionGroup(options) {
        return new RadioOptionGroup(options, this.itemId);
    }

    createAutocomplete(options) {
        return new Autocomplete(options, this.itemId);
    }
}
