import { createNewItem } from "./item-editor.js";



$(document).ready(function () {
    // loads item HTML and adds blank item to json
    $("#add-items-button").click(() => {
        createNewItem();
    });
});
