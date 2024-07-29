import { updateInput } from "./localstorage-utils.js"

export class ComponentFactory {
    constructor(containerElement, id) {
        this.containerSelector = $(`${containerElement}`);
        this.containerSelector.attr("data-id", id);
    }

    addFieldToElement(element, property, parentElement, item, withLabel = true, additionalClasses = "") {

        // Remove any leading # from the element string
        const cleanElementId = element.replace(/^#/, '');

        console.log(item[property]);
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

    createEditableBox(element, updateProperty, parentElement, additionalClasses = "", inputType) {

        // Remove any leading # from the element string
        const cleanElementId = element.replace(/^#/, '');

        // Convert updateProperty for display
        const displayProperty = this.formatDisplayProperty(updateProperty);

        // Create the new HTML content for the text box element
        const newTextBoxHTML = `
        <div class="flex-fill ${additionalClasses}">
            <h3>${displayProperty}</h3>
            <div class="text-box editable-box" id="${cleanElementId}" contenteditable="true" data-placeholder="Enter ${displayProperty}"></div>
        </div>
        `;

        $(parentElement).append(newTextBoxHTML);


        const $elementSelector = $(element);

        $elementSelector.on("input", (event) => updateInput(event, updateProperty, this.containerSelector, inputType));
    }

    createEditableText(element, updateProperty, parentElement, defaultText, additionalClasses = "") {
        const cleanElementId = element.replace(/^#/, '');

        // Create the new HTML content for the editable text element
        const newEditableTextHTML = `
        <div class="flex-fill">
            <div id="${cleanElementId}" class="editable-text ${additionalClasses}">${defaultText}</div>
        </div>
        `;

        $(parentElement).append(newEditableTextHTML);

        const $elementSelector = $(element);

        // Attach event listeners
        $elementSelector.on("input", (event) => updateInput(event, updateProperty, this.containerSelector));
        $elementSelector.on("click", this.handleEditableTextClick);
        $elementSelector.on("keypress", this.handleEnterKey);
        $elementSelector.on("paste", this.handlePaste);
        $elementSelector.on("blur", this.handleBlur);
    }

    createSelect(element, updateProperty, ancestorElement, options, placeholder = "Select an option", additionalClasses = "") {
        // Generate options HTML
        const optionsHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');

        // Remove any leading # from the element string
        const cleanElementId = element.replace(/^#/, '');

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
        $(ancestorElement).append(newSelectHTML);

        const $elementSelector = $(element);

        // Attach event listener
        $elementSelector.on("change", (event) => updateInput(event, updateProperty, this.containerSelector));
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
