import { initializeEditableText } from "../components/editable-text.js";

import { newItem } from "./new-item.js";



$(document).ready(function () {
    // Creates new inventory item and adds to JSON
    newItem();

    // Makes item name editable for the given property and updates JSON
    initializeEditableText("item-name", "name");
});
