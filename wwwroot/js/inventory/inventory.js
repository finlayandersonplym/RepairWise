import { createNewItem, populateTable } from "./item-editor.js";
import { exportLocalStorageToFile, importJsonFileToLocalStorage } from "../localstorage-utils.js";
export function initializeInventoryPage() {
    populateTable();
    $("#add-items-button").click(() => {
        createNewItem();
    });
    $("#export-items").click(() => {
        exportLocalStorageToFile();
    });
    $("#file-input").on("change", function () {
        const file = this.files[0]; 
        importJsonFileToLocalStorage(file);
        populateTable();
    });

}

$(document).ready(function () {
    initializeInventoryPage();
});
