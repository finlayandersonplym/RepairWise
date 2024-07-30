import { updateInput } from "./localstorage-utils.js"
import { editExistingItem } from "./inventory/item-editor.js";
export class ComponentFactory {
    constructor(containerElement, id) {
        this.containerSelector = $(`${containerElement}`);
        this.containerSelector.attr("data-id", id);
        this.itemId = id;
    }

    addFieldToElement(elementId, property, parentElement, item, withLabel = true, additionalClasses = "") {

        // Remove any leading # from the element string
        const cleanElementId = elementId.replace(/^#/, '');

        // Convert updateProperty for display
        const displayProperty = this.formatDisplayProperty(property);

        const newFieldHTML = `
        <div class="${additionalClasses}">
            ${withLabel ? `<span class="property-label">${displayProperty}</span>` : ''}
            <span id="${cleanElementId}">${item[property]}</span>
        </div>
        `;

        $(parentElement).append(newFieldHTML);
    }

    createEditableBox(elementId, updateProperty, parentElement, additionalClasses = "", inputType, defaultText="") {

        // Remove any leading # from the element string
        const cleanElementId = elementId.replace(/^#/, '');

        // Convert updateProperty for display
        const displayProperty = this.formatDisplayProperty(updateProperty);

        // Create the new HTML content for the text box element
        const newTextBoxHTML = `
        <div class="flex-fill ${additionalClasses}">
            <h3>${displayProperty}</h3>
            <div class="text-box editable-box" id="${cleanElementId}" contenteditable="true" data-placeholder="Enter ${displayProperty}">${defaultText}</div>
        </div>
        `;

        $(parentElement).append(newTextBoxHTML);


        const $elementSelector = $(elementId);

        $elementSelector.on("input", (event) => updateInput(event, updateProperty, this.containerSelector, inputType));
    }

    createEditableText(elementId, updateProperty, parentElement, defaultText, additionalClasses = "") {
        const cleanElementId = elementId.replace(/^#/, '');

        // Create the new HTML content for the editable text element
        const newEditableTextHTML = `
        <div class="flex-fill">
            <div id="${cleanElementId}" class="editable-text ${additionalClasses}">${defaultText}</div>
        </div>
        `;

        $(parentElement).append(newEditableTextHTML);

        const $elementSelector = $(elementId);

        // Attach event listeners
        $elementSelector.on("input", (event) => updateInput(event, updateProperty, this.containerSelector));
        $elementSelector.on("click", this.handleEditableTextClick);
        $elementSelector.on("keypress", this.handleEnterKey);
        $elementSelector.on("paste", this.handlePaste);
        $elementSelector.on("blur", this.handleBlur);
    }

    createSelect(elementId, updateProperty, parentElement, options, placeholder = "Select an option", additionalClasses = "") {
        // Generate options HTML
        const optionsHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');

        // Remove any leading # from the element string
        const cleanElementId = elementId.replace(/^#/, '');

        // Create the new HTML content for the select element
        const newSelectHTML = `
            <div class="flex-fill ${additionalClasses}">
                <h3>${this.formatDisplayProperty(updateProperty)}</h3>
                <select class="editable-box form-select" id="${cleanElementId}">
                    <option style="display: none" value="" selected>${placeholder}</option>
                    ${optionsHTML}
                </select>
            </div>
        `; 
        $(parentElement).append(newSelectHTML);

        const $elementSelector = $(elementId);

        // Attach event listener
        $elementSelector.on("click", (event) => updateInput(event, updateProperty, this.containerSelector));
    }

    createEditButton(elementId, parentElement, additionalClasses = "") {
        // Remove any leading # from the element string
        const cleanElementId = elementId.replace(/^#/, '');

        // Create the HTML for the edit button
        const editButtonHTML = `
            <button id="${cleanElementId}" class="edit-button ${additionalClasses}">
                Edit
            </button>
        `;

        // Append the button to the parent element
        $(parentElement).append(editButtonHTML);

        const $elementSelector = $(elementId);

        console.log(this.itemId);
        // Attach click event listener
        $elementSelector.on("click", () => editExistingItem(this.itemId));
    }

    formatDisplayProperty(property) {
        return property
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => this.capitalizeFirstLetter(word))
            .join(' ');
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

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
