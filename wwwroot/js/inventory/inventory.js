import { loadItemEditor } from "./item-editor.js";
import { LocalStorageManager } from "../localstorage-utils.js";
import TableManager from "./table-manager.js";

const localStorageManager = new LocalStorageManager();
const tableManager = new TableManager("itemList", "#item-table", "#item-filter-text");

export function initializeInventoryPage() {
    tableManager.attachFilterHandler();
    tableManager.populateTable();

    $("#add-items-button").click(() => {
        loadItemEditor();
    });

    $("#export-items").click(() => {
        localStorageManager.exportLocalStorageToFile("inventory");
    });

    $("#file-input").on("change", function () {
        const file = this.files[0];
        localStorageManager.importJsonFileToLocalStorage(file);
        tableManager.populateTable();
    });
}

$(document).ready(function () {
    initializeInventoryPage();
});
