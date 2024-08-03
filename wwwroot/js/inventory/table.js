import { openExistingItem } from "./item-editor.js";
import { getJsonItems } from "../localstorage-utils.js";
export function populateTable() {
    console.log("Loading: item-table.html");

    $("#item-table").load("pages/inventory/item-table.html", () => {
        const items = getJsonItems("itemList");
        const $tableBody = $("#item-table-body");
        $tableBody.empty();

        //$item-filter = $("")
        let selectedState = $("#item-filter-text").text();

        items.forEach(item => {
            // Only add the item to the table if its state matches the desired state
            if (item.state === selectedState) {
                const row = `<tr class="interactive-row" data-id="${item.id}">
                    <td><input class="form-check-input" type="checkbox" value="" id="${item.id}"></td>
                    <td class="table-item table-item">${item.name}</td>
                    <td class="table-item">&pound${item.selling_price}</td>
                </tr>`;
                $tableBody.append(row);
            }
        });

        $(".interactive-row").click(function (event) {
            if (event.target.type !== "checkbox") { // Check if the click was not on a checkbox
                const itemId = $(this).data("id");
                openExistingItem(itemId);
            }
        });
    });
}

export function tableFilter() {
    $(".dropdown-item.filter-option").click(function () {
        // Get the text of the clicked item
        var selectedItemText = $(this).text();

        // Update the dropdown text
        $("#item-filter-text").text(selectedItemText);
        populateTable();
    });
}