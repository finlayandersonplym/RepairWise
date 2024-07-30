import { addJsonItem, getJsonItem } from "../localstorage-utils.js";
import { ComponentFactory }  from "../componentFactory.js";
import { populateTable } from "./table.js";
export function openExistingItem(itemId) {
    $("#selection-loader").load("pages/inventory/existing-item.html", () => {

        const item = getJsonItem("itemList", "id", itemId);

        const componentFactory = new ComponentFactory("", itemId);

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

        componentFactory.createEditButton("#item-edit-button", "#item-properties-section", "btn btn-primary")
    });
}

export function createNewItem() {
    console.log("Loading: add-item.html");

    $("#selection-loader").load("pages/inventory/item-editor.html", () => {
        const skeleton = {
            id: "",
            name: "Unnamed Item",
            description: "",
            state: "Unknown",
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

        const stateOptions = ["Serviced", "In Progress", "Pending Inspection", "Completed", "Unknown"];
        componentFactory.createSelect("#state-select", "state", "#item-edit-section", stateOptions, "Current State of Item", "live-item edit-gap-sizing");

        componentFactory.createEditableBox("#item-selling-price", "selling_price", "#item-edit-section", "live-item edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-quantity", "quantity", "#item-edit-section", "edit-gap-sizing", "integer");
        componentFactory.createEditableBox("#item-brand", "brand", "#item-edit-section", "edit-gap-sizing", "string");
        componentFactory.createEditableBox("#item-cost-price", "cost_price", "#item-edit-section", "edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-repair-price", "repair_price", "#item-edit-section", "edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-weight", "weight", "#item-edit-section", "edit-gap-sizing", "float");
        componentFactory.createEditableBox("#item-dimensions", "dimensions", "#item-edit-section", "edit-gap-sizing", "string");


        // Update the table with the new item
        populateTable();

        // Refresh the table when any live-item input changes
        $(".live-item").on("input", populateTable);
    });
}

export function editExistingItem(itemId) {
    $("#selection-loader").load("pages/inventory/item-editor.html", () => {
        const item = getJsonItem("itemList", "id", itemId);

        const componentFactory = new ComponentFactory("#new-item-section", itemId);

        componentFactory.createEditableText("#item-name-text", "name", "#item-name-section", item.name);
        componentFactory.createEditableBox("#edit-description-text", "description", "#edit-description-section", "", "", item.description);

        const stateOptions = ["Serviced", "In Progress", "Pending Inspection", "Completed", "Unknown"];
        componentFactory.createSelect("#state-select", "state", "#item-edit-section", stateOptions, item.state, "live-item edit-gap-sizing");

        componentFactory.createEditableBox("#item-selling-price", "selling_price", "#item-edit-section", "live-item edit-gap-sizing", "float", item.selling_price);
        componentFactory.createEditableBox("#item-quantity", "quantity", "#item-edit-section", "edit-gap-sizing", "integer", item.quantity);
        componentFactory.createEditableBox("#item-brand", "brand", "#item-edit-section", "edit-gap-sizing", "string", item.brand);
        componentFactory.createEditableBox("#item-cost-price", "cost_price", "#item-edit-section", "edit-gap-sizing", "float", item.cost_price);
        componentFactory.createEditableBox("#item-repair-price", "repair_price", "#item-edit-section", "edit-gap-sizing", "float", item.repair_price);
        componentFactory.createEditableBox("#item-weight", "weight", "#item-edit-section", "edit-gap-sizing", "float", item.weight);
        componentFactory.createEditableBox("#item-dimensions", "dimensions", "#item-edit-section", "edit-gap-sizing", "string", item.dimensions);

        populateTable();

        // Refresh the table when any live-item input changes
        $(".live-item").on("input", populateTable)
    });
}