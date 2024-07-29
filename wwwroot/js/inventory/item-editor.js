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
                <td class="table-item">&pound${item.selling_price}</td>
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

        const componentFactory = new ComponentFactory();

        componentFactory.addFieldToElement("#item-name", "name", "#item-name-header", item, false, "padding-x padding-y");

        componentFactory.addFieldToElement("#item-description-text", "description", "#item-description-text", item, false);

        componentFactory.addFieldToElement("#item-price", "selling_price", "#item-properties-section", item);
        componentFactory.addFieldToElement("#item-cost-price", "cost_price", "#item-properties-section", item);
        componentFactory.addFieldToElement("#item-repair-price", "repair_price", "#item-properties-section", item);
        componentFactory.addFieldToElement("#item-quantity", "quantity", "#item-properties-section", item);
        componentFactory.addFieldToElement("#item-brand", "brand", "#item-properties-section", item);
        componentFactory.addFieldToElement("#item-weight", "weight", "#item-properties-section", item);
        componentFactory.addFieldToElement("#item-dimensions", "dimensions", "#item-properties-section", item);
        componentFactory.addFieldToElement("#item-state", "state", "#item-properties-section", item);
    });
}

// createNewItem.js

export function createNewItem() {
    console.log("Loading: add-item.html");

    $("#selection-loader").load("pages/inventory/new-item.html", () => {
        const skeleton = {
            id: "",
            name: "Unnamed Item",
            description: "",
            state: "",
            selling_price: 0,
            cost_price: 0,
            repair_price: 0,
            quantity: 0,
            brand: "",
            weight: 0,
            dimensions: "",
        };
        const newId = addJsonItem("itemList", skeleton);

        const componentFactory = new ComponentFactory("#new-item-section", newId);

        // Initialize all essential fields with editable properties
        componentFactory.createEditableText("#item-name-text", "name", "#item-name-section", "Unnamed Item");
        componentFactory.createEditableBox("#edit-description-text", "description", "#edit-description-section");

        const stateOptions = ["Serviced", "In Progress", "Pending Inspection"];
        componentFactory.createSelect("#state-select", "state", "#item-edit-section", stateOptions, "Current State of Item", "edit-gap-sizing");

        componentFactory.createEditableBox("#item-selling-price", "selling_price", "#item-edit-section", "live-item edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-quantity", "quantity", "#item-edit-section", "edit-gap-sizing", "integer");
        componentFactory.createEditableBox("#item-brand", "brand", "#item-edit-section", "edit-gap-sizing", "string");
        componentFactory.createEditableBox("#item-cost-price", "cost_price", "#item-edit-section", "edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-repair-price", "repair_price", "#item-edit-section", "edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-weight", "weight", "#item-edit-section", "edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-dimensions", "dimensions", "#item-edit-section", "edit-gap-sizing", "string");


        // Dynamically loading fields based on the state
        toggleFieldsBasedOnState("#state-select");

        // Update the table with the new item
        populateTable();

        // Refresh the table when any live-item input changes
        $(".live-item").on("input", populateTable);
    });
}


