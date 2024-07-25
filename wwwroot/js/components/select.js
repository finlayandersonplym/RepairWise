import { updateInput } from "../localstorage-utils.js";

export function initializeSelect(element, updateProperty) {
    const targetElement = `#${element}`;

    $(targetElement).on("change", (event) => {
        updateInput(event, updateProperty)
    });
}