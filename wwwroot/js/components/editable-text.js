import { updateJsonItemProperty } from "../localstorage-utils.js"

export function initializeEditableText(element, updateProperty) {
    const currentElementSelector = `#${element}`;

    $(document).on("click", currentElementSelector, (event) => {
        const textElement = $(event.currentTarget).find(">:first-child");

        // Make text element editable and focus on it
        textElement.attr("contenteditable", "true").addClass("active-editable").focus();

        // Blur the element on Enter key press
        textElement.on("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                textElement.blur();
            }
        });

        // Handle paste event
        textElement.on("paste", (e) => {
            e.preventDefault();
            let clipboardData = (e.originalEvent || e).clipboardData;
            let pastedData = clipboardData.getData('text/plain');
            // Strip HTML tags using a temporary div
            let cleanedData = $('<div>').text(pastedData).html();
            document.execCommand('insertText', false, cleanedData);
        });


        textElement.on("blur", function () {
            handleBlur.call(this, updateProperty);
        });
    });
}

function handleBlur(updateProperty) {
    const textElement = $(this);
    textElement.attr("contenteditable", "false").removeClass("active-editable");

    textElement.removeClass("editable-text").addClass("edited-text");

    // Unbind blur event to avoid multiple bindings
    textElement.off("blur");

    let elementId = textElement.attr("data-id");

    // Use the passed updateProperty to update the corresponding property in local storage
    updateJsonItemProperty("itemList", updateProperty, textElement.text(), "id", elementId);
}