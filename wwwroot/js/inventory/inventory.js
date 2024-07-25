import { openExistingItem, createNewItem, populateTable } from "./item-editor.js";



$(document).ready(function () {
    // loads item HTML and adds blank item to json

    createNewItem();
    /*openExistingItem(1);
    populateTable();*/
    $("#add-items-button").click(() => {
        createNewItem();
    });
});
