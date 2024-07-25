import { addJsonItem, getJsonItem, getJsonItems } from "../localstorage-utils.js";
import { initializeEditableText } from "../components/editable-text.js";
import { initializeEditableBox } from "../components/text-box.js";
import { initializeSelect } from "../components/select.js";

export function populateTable() {
    console.log("Loading: item-table.html");

    $("#item-table").load("pages/inventory/item-table.html", () => {
        const items = getJsonItems("itemList");
        const tableBody = $("#item-table-body");
        tableBody.empty();

        items.forEach(item => {
            const row = `<tr class="interactive-row" data-id="${item.id}">
                <td scope="row"><input class="form-check-input" type="checkbox" value="" id="${item.id}"></td>
                <td class="table-item-name">${item.name}</td>
                <td class="table-item-price">${item.price}</td>
            </tr>`;
            tableBody.append(row);
        });

        $(".interactive-row").click(function () {
            const itemId = $(this).data('id');
            openExistingItem(itemId);
        });
    });
}


export function openExistingItem(itemId) {
    $("#selection-loader").load("pages/inventory/existing-item.html", () => {

        const item = getJsonItem("itemList", "id", itemId);

        $("#item-name-text").text(`${item.name}`);

        $("#item-description-text").text(`${item.description}`);

        $("#item-price").text(`${item.price}`);
    });
}

// createNewItem.js

export function createNewItem() {
    console.log("Loading: add-item.html");

    $("#selection-loader").load("pages/inventory/new-item.html", () => {
        const skeleton = { id: "", name: "Unnamed Item", description: "", state: "", price: "", quantity: "" };
        const newId = addJsonItem("itemList", skeleton);

        // Set the data-id on the parent container
        $("#new-item-section").attr("data-id", newId);

        // Initialize fields with editable properties
        initializeEditableText("#item-name-text", "name", "#new-item-section", "Unnamed Item");
        initializeEditableBox("#edit-description-text", "description", "#new-item-section");
        initializeSelect("#state-select", "state", "#new-item-section");
        initializeEditableBox("#item-price", "price", "#new-item-section");
        initializeEditableBox("#item-quantity", "quantity", "#new-item-section");

        // Update the table with the new item
        populateTable();

        // Refresh the table when any live-item input changes
        $(".live-item").on("input", populateTable);
    });
}


