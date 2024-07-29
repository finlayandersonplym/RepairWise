import { openExistingItem, createNewItem, populateTable } from "./item-editor.js";

export function initializeInventoryPage() {
    populateTable();
    $("#add-items-button").click(() => {
        createNewItem();
    });
    $("#options-dropdown").click(() => {
        openOptions();
    });
}

$(document).ready(function () {
    initializeInventoryPage();
});
