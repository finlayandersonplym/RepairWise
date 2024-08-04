import { LocalStorageManager } from "../localstorage-utils.js";
import { ComponentFactory } from "../components/component-factory.js";
import TableManager from "./table-manager.js";

const localStorageManager = new LocalStorageManager();
const tableManager = new TableManager("itemList", "#item-table", "#item-filter-text");

export function openExistingItem(itemId) {
    $("#selection-loader").load("pages/inventory/existing-item.html", () => {
        const item = localStorageManager.getJsonItem("itemList", "id", itemId);
        const componentFactory = new ComponentFactory(itemId);

        componentFactory.addTextField({
            elementId: "#item-name",
            property: "name",
            parentElement: "#item-name-header",
            item: item,
            withLabel: false,
            additionalClasses: "padding-x padding-y"
        });

        componentFactory.addTextField({
            elementId: "#item-description-text",
            property: "description",
            parentElement: "#item-description-text",
            item: item,
            withLabel: false
        });

        const properties = [
            { elementId: "#item-price", property: "selling_price" },
            { elementId: "#item-cost-price", property: "cost_price" },
            { elementId: "#item-repair-price", property: "repair_price" },
            { elementId: "#item-quantity", property: "quantity" },
            { elementId: "#item-brand", property: "brand" },
            { elementId: "#item-weight", property: "weight" },
            { elementId: "#item-dimensions", property: "dimensions" },
            { elementId: "#item-state", property: "state" }
        ];

        properties.forEach(({ elementId, property }) => {
            componentFactory.addTextField({
                elementId,
                property,
                parentElement: "#item-properties-section",
                item: item
            });
        });

        componentFactory.createEditItemButton({
            elementId: "#item-edit-button",
            parentElement: "#item-properties-section",
            additionalClasses: "btn btn-primary"
        });
    });
}

export function loadItemEditor(itemId = null) {
    console.log("Loading: item-editor.html");

    $("#selection-loader").load("pages/inventory/item-editor.html", () => {
        let item, newId;
        if (itemId) {
            item = localStorageManager.getJsonItem("itemList", "id", itemId);
            newId = itemId;
        } else {
            item = {
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
            newId = localStorageManager.addJsonItem("itemList", item);
        }

        const componentFactory = new ComponentFactory(newId);

        componentFactory.createLiveEditableText({
            elementId: "#item-name-text",
            updateProperty: "name",
            parentElement: "#item-name-section",
            defaultText: item.name,
            additionalClasses: "live-item",
        });

        componentFactory.createTextBox({
            elementId: "#edit-description-text",
            updateProperty: "description",
            parentElement: "#edit-description-section",
            defaultText: item.description,
        });

        const stateOptions = ["Serviced", "In Progress", "Pending Inspection", "Completed", "Sold", "Unknown"];
        componentFactory.createSelect({
            elementId: "#state-select",
            updateProperty: "state",
            parentElement: "#item-edit-section",
            options: stateOptions,
            defaultValue: item.state,
            additionalClasses: "live-item edit-gap-sizing",
        });

        console.log(item.state);

        componentFactory.createTextBox({
            elementId: "#item-selling-price",
            updateProperty: "selling_price",
            parentElement: "#item-edit-section",
            additionalClasses: "live-item edit-gap-sizing",
            inputType: "float",
            defaultText: item.selling_price,
        });

        componentFactory.createTextBox({
            elementId: "#item-quantity",
            updateProperty: "quantity",
            parentElement: "#item-edit-section",
            additionalClasses: "edit-gap-sizing",
            inputType: "integer",
            defaultText: item.quantity,
        });

        componentFactory.createTextBox({
            elementId: "#item-brand",
            updateProperty: "brand",
            parentElement: "#item-edit-section",
            additionalClasses: "edit-gap-sizing",
            inputType: "string",
            defaultText: item.brand,
        });

        componentFactory.createTextBox({
            elementId: "#item-cost-price",
            updateProperty: "cost_price",
            parentElement: "#item-edit-section",
            additionalClasses: "edit-gap-sizing",
            inputType: "float",
            defaultText: item.cost_price,
        });

        componentFactory.createTextBox({
            elementId: "#item-repair-price",
            updateProperty: "repair_price",
            parentElement: "#item-edit-section",
            additionalClasses: "edit-gap-sizing",
            inputType: "float",
            defaultText: item.repair_price,
        });

        componentFactory.createTextBox({
            elementId: "#item-weight",
            updateProperty: "weight",
            parentElement: "#item-edit-section",
            additionalClasses: "edit-gap-sizing",
            inputType: "float",
            defaultText: item.weight,
        });

        componentFactory.createTextBox({
            elementId: "#item-dimensions",
            updateProperty: "dimensions",
            parentElement: "#item-edit-section",
            additionalClasses: "edit-gap-sizing",
            inputType: "string",
            defaultText: item.dimensions,
        });

        tableManager.populateTable();

        $(".live-item").on("input", tableManager.populateTable.bind(tableManager));
    });
}
