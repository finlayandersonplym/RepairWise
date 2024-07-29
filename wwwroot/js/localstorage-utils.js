import { populateTable } from "./inventory/item-editor.js";

// Adding custom listeners for logging

const originalSetItem = localStorage.setItem.bind(localStorage);
const originalRemoveItem = localStorage.removeItem.bind(localStorage);

localStorage.setItem = function (key, value) {
    originalSetItem(key, value);
    console.log(`Set item: ${key} = ${value}`);
};

localStorage.removeItem = function (key) {
    originalRemoveItem(key);
    console.log(`Removed item: ${key}`);
}


/**
 * Adds a value to a list stored in localStorage under the given key and updates + increments ID
 *
 * @param {string} key - The key under which the list is stored in localStorage.
 * @param {any} value - The value to be added to the list.
 * @returns {number} - The ID assigned to the added item.
 */

export function addJsonItem(key, value) {
    // Get the next ID
    let currentId = parseInt(localStorage.getItem("itemID") || "0") + 1;
    localStorage.setItem("itemID", currentId.toString());

    // Add new ID to the value object
    value.id = currentId;

    let currentValue = JSON.parse(localStorage.getItem(key) || "[]");

    currentValue.push(value);
    localStorage.setItem(key, JSON.stringify(currentValue));

    return currentId;
}



/**
 * Updates a value in a list stored in localStorage under the given key.
 *
 * @param {string} key - The key under which the list is stored in localStorage.
 * @param {string} updateProperty - The property to be updated with the new value.
 * @param {any} updateValue - The new value to be updated in the list.
 * @param {string} matchProperty - The name of the property of the item to match for updating.
 * @param {any} matchValue - The value to match in the list items for updating.
 */
export function updateJsonItemProperty(key, updateProperty, updateValue, matchProperty, matchValue) {
    let currentValue = JSON.parse(localStorage.getItem(key));

    currentValue = currentValue.map((item) => {
        if (item[matchProperty] == matchValue) {
            item[updateProperty] = updateValue;
        }
        return item;
    });

    localStorage.setItem(key, JSON.stringify(currentValue));
}

/**
 * Handles the input event for a contenteditable element, updating the corresponding property in localStorage.
 *
 * @param {Event} event - The input event triggered on the contenteditable element.
 * @param {string} updateProperty - The property to be updated with the new value.
 * @param {string} containerElement - The selector for the parent container that holds the data-id.
 */
export function updateInput(event, updateProperty, containerElement, inputType) {
    const element = $(event.currentTarget);
    const elementId = element.closest(containerElement).attr("data-id");

    let newValue = element.text().trim();

    // Keep in mind that JSON doesn't have integers or floats just number
    switch (inputType) {
        case "integer":
            newValue = parseInt(newValue, 10);
            break;
        case "float":
            newValue = parseFloat(newValue);
            break;
        case "string":
            newValue = String(newValue);
            break;
    }

    if (isNaN(newValue) && (inputType === "integer" || inputType === "float")) {
        newValue = null; // Handle invalid numbers gracefully
    }

    updateJsonItemProperty("itemList", updateProperty, newValue, "id", elementId);
}

/**
* Retrieves a list of items stored in localStorage under the given key.
*
* @param {string} storageKey - The key under which the list of items is stored in localStorage.
* @returns {Array} - The array of items retrieved from localStorage. Returns an empty array if no items are found.
*/
export function getJsonItems(storageKey) {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];
    return items;
}


/**
 * Retrieves a single item from a list stored in localStorage by matching a specific property and value.
 *
 * @param {string} key - The key under which the list of items is stored in localStorage.
 * @param {string} matchProperty - The property name to match against in the items.
 * @param {any} matchValue - The value to match for the specified property.
 * @returns {Object|null} - The first item that matches the criteria, or null if no match is found.
 */
export function getJsonItem(key, matchProperty, matchValue) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    return items.find(item => item[matchProperty] == matchValue) || null;
}
