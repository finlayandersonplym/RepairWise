import { updateInput } from "../localstorage-utils.js"

export function initializeEditableText(element, updateProperty) {
    const currentElementSelector = `#${element}`;

    $(document).on("click", currentElementSelector, (event) => {

        const targetElement = $(event.currentTarget);
        // Set the element to thhe first child of the text to not effect icons or if they have no children the textElement is kept
        const textElement = targetElement.children().length > 0 ? targetElement.find(">:first-child") : targetElement;


        // Make text element editable and focus on it
        textElement.attr("contenteditable", "true").addClass("active-editable").focus();


        //// Event Handlers ////

        // Blur the element on Enter key press
        textElement.on("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                textElement.blur();
            }
        });

        // Handle paste event
        textElement.on("paste", (event) => {
            event.preventDefault();
            let clipboardData = (event.originalEvent || event).clipboardData;
            let pastedData = clipboardData.getData("text/plain");
            // Strip HTML tags using a temporary div
            let cleanedData = $("<div>").text(pastedData).html();
            document.execCommand("insertText", false, cleanedData);
        });

        // On blur make sure to add styling
        textElement.on("blur", (event) => {
            $(event.currentTarget).attr("contenteditable", "false").removeClass("active-editable");
            $(event.currentTarget).removeClass("editable-text").addClass("edited-text");

            // Unbind blur event to avoid multiple bindings
            textElement.off("blur");
        });

        // Update localStorage value on input
        textElement.on("input", (event) => updateInput(event, updateProperty));
    });
}