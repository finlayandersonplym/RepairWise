import { loadItemEditor } from "./item-editor.js";
import { exportLocalStorageToFile, importJsonFileToLocalStorage } from "../localstorage-utils.js";
import { populateTable, tableFilter } from "./table.js";

export function initializeInventoryPage() {
    tableFilter();
    populateTable();
    $("#add-items-button").click(() => {
        loadItemEditor();
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
