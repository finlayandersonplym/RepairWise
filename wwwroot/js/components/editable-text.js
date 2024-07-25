import { updateInput } from "../localstorage-utils.js"

export function initializeEditableText(element, updateProperty, containerElement, defaultText) {
    const selector = $(element);
    selector.text(defaultText);
    console.log(defaultText);

    selector.on("click", (event) => {
        const targetElement = $(event.currentTarget);
        const textElement = targetElement.children().length > 0 ? targetElement.find(">:first-child") : targetElement;

        makeEditable(textElement);
        bindEvents(textElement, updateProperty, containerElement);
    });
}

function makeEditable(textElement) {
    textElement.attr("contenteditable", "true").addClass("active-editable").focus();
}

function bindEvents(textElement, updateProperty, containerElement) {
    textElement.on("keypress", handleEnterKey);
    textElement.on("paste", handlePaste);
    textElement.on("blur", handleBlur);

    // Requires property and event to update the 
    textElement.on("input", (event) => updateInput(event, updateProperty, containerElement));
}

function handleEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        $(event.currentTarget).blur();
    }
}

function handlePaste(event) {
    event.preventDefault();
    const clipboardData = (event.originalEvent || event).clipboardData;
    const pastedData = clipboardData.getData("text/plain");
    const cleanedData = $("<div>").text(pastedData).html();
    document.execCommand("insertText", false, cleanedData);
}

function handleBlur(event) {
    $(event.currentTarget).attr("contenteditable", "false").removeClass("active-editable");
}