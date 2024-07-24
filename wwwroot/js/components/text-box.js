import { updateInput } from "../localstorage-utils.js";

export function initializeEditableBox(element, updateProperty) {
    const targetElement = `#${element}`;

    $(targetElement).on("input", (event) => {
        updateInput(event, updateProperty)
    });
}