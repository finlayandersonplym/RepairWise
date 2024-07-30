import { populateTable } from "./inventory/table.js";

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

    let newValue;
    if (element.is("select")) {
        newValue = element.val();
    } else {
        newValue = element.text().trim();
    }


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

/**
 * Exports all data from localStorage as a JSON file.
 *
 * @param {string} fileName - The name of the file to be downloaded.
 */
export function exportLocalStorageToFile() {

    // Collect all data from localStorage
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let value = localStorage.getItem(key);
        try {
            // Attempt to parse the value as JSON if possible
            value = JSON.parse(value);
        } catch (e) {
            // If parsing fails keep the value as is (likely a string)
        }
        localStorageData[key] = value;
    }

    // Convert the collected data to a JSON string
    const data = JSON.stringify(localStorageData, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([data], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element and set its href to the Blob URL
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localStorageData.json';

    // Append the anchor to the document, trigger a click, then remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * Imports JSON data into localStorage.
 *
 * @param {string} jsonData - The JSON string containing data to import.
 */
export function importJsonToLocalStorage(jsonData) {
    try {
        // Parse the JSON data
        const data = JSON.parse(jsonData);

        // Validate that the parsed data is an object
        if (typeof data !== 'object' || data === null) {
            console.error("Invalid JSON data provided.");
            return;
        }

        // Iterate over each key-value pair and store it in localStorage
        for (const [key, value] of Object.entries(data)) {
            // Convert value to JSON string before storing in localStorage
            localStorage.setItem(key, JSON.stringify(value));
        }

        console.log("Data successfully imported into localStorage.");
    } catch (e) {
        console.error("Failed to import data: ", e);
    }
}

/**
* Reads a JSON file and imports its content into localStorage.
*
* @param {File} file - The JSON file to be read and imported.
*/
export function importJsonFileToLocalStorage(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const jsonData = event.target.result;
        importJsonToLocalStorage(jsonData);
    };
    reader.onerror = (event) => {
        console.error("Failed to read file: ", event.target.error);
    };
    reader.readAsText(file);
}