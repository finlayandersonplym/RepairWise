import { updateInput } from "../localstorage-utils.js";

export function initializeSelect(element, updateProperty, containerElement) {
    const selector = `${element}`;

    $(selector).on("change", (event) => {
        updateInput(event, updateProperty, containerElement)
    });
}