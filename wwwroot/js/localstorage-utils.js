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
 */
export function updateInput(event, updateProperty) {
    const textElement = $(event.currentTarget);
    let elementId = textElement.attr("data-id");

    updateJsonItemProperty("itemList", updateProperty, textElement.text(), "id", elementId);
}