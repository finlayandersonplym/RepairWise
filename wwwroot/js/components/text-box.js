import { updateInput } from "../localstorage-utils.js";

export function initializeEditableBox(element, updateProperty, containerElement) {
    const selector = `${element}`;

    $(selector).on("input", (event) => {
        updateInput(event, updateProperty, containerElement)
    });
}