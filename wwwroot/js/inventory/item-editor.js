import { addJsonItem, getJsonItem, getJsonItems } from "../localstorage-utils.js";
import { toggleFieldsBasedOnState } from "./state-options.js";
import { ComponentFactory }  from "../componentFactory.js";
export function populateTable() {
    console.log("Loading: item-table.html");

    $("#item-table").load("pages/inventory/item-table.html", () => {
        const items = getJsonItems("itemList");
        const tableBody = $("#item-table-body");
        tableBody.empty();

        items.forEach(item => {
            const row = `<tr class="interactive-row" data-id="${item.id}">
                <td><input class="form-check-input" type="checkbox" value="" id="${item.id}"></td>
                <td class="table-item table-item">${item.name}</td>
                <td class="table-item">&pound${item.price}</td>
            </tr>`;
            tableBody.append(row);
        });

        $(".interactive-row").click(function (event) {
            if (event.target.type !== 'checkbox') { // Check if the click was not on a checkbox
                const itemId = $(this).data('id');
                openExistingItem(itemId);
            }
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
        const skeleton = { id: "", name: "Unnamed Item", description: "", state: "", price: "0.00", quantity: "", brand: ""};
        const newId = addJsonItem("itemList", skeleton);

        const componentFactory = new ComponentFactory("#new-item-section", newId);

        // Initialize all essential fields with editable properties
        componentFactory.createEditableText("#item-name-text", "name", "#item-name-section", "Unnamed Item");
        componentFactory.createEditableBox("#edit-description-text", "description", "#edit-description-section");

        const stateOptions = ["Serviced", "In Progress", "Pending Inspection"];
        componentFactory.createSelect("#state-select", "state", "#item-edit-section", stateOptions, "Current State of Item", "edit-gap-sizing");

        componentFactory.createEditableBox("#item-price", "price", "#item-edit-section", "live-item edit-gap-sizing");
        componentFactory.createEditableBox("#item-quantity", "quantity", "#item-edit-section", "edit-gap-sizing");
        componentFactory.createEditableBox("#item-brand", "brand", "#item-edit-section", "edit-gap-sizing");


        // Dynamically loading fields based on the state
        toggleFieldsBasedOnState("#state-select");

        // Update the table with the new item
        populateTable();

        // Refresh the table when any live-item input changes
        $(".live-item").on("input", populateTable);
    });
}


