import { LocalStorageManager } from "../localstorage-utils.js";
import { ComponentFactory } from "../components/component-factory.js";
import { TableManager } from "./table-manager.js";

export class InventoryManager {
    #localStorageManager;
    #tableManager;
    constructor(itemListKey, tableSelector, filterSelector) {
        this.#localStorageManager = new LocalStorageManager();
        this.#tableManager = new TableManager(itemListKey, tableSelector, filterSelector);
    }

    openExistingItem(itemId) {
        $("#selection-loader").load("pages/inventory/existing-item.html", () => {
            const item = this.#localStorageManager.getJsonItem("itemList", "id", itemId);
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

            const tableManager = new TableManager("itemList", "#item-table", "#item-filter-text");

            componentFactory.createDeleteItemButton({
                elementId: "#item-delete-button",
                parentElement: "#item-properties-section",
                additionalClasses: "btn btn-danger",
            },
                tableManager
            );
        });
    }

    loadItemEditor(itemId = null) {
        console.log("Loading: item-editor.html");

        $("#selection-loader").load("pages/inventory/item-editor.html", () => {
            let item, newId;
            if (itemId) {
                item = this.#localStorageManager.getJsonItem("itemList", "id", itemId);
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
                    category: "",
                    history: [],
                };
                newId = this.#localStorageManager.addJsonItem("itemList", item);
            }

            const componentFactory = new ComponentFactory(newId);

            componentFactory.createLiveEditableText({
                elementId: "#item-name-text",
                updateProperty: "name",
                parentElement: "#item-name-section",
                defaultText: item.name,
                additionalClasses: "live-item",
                displayProperty: "Item Name"
            });

            componentFactory.createTextBox({
                elementId: "#edit-description-text",
                updateProperty: "description",
                parentElement: "#edit-description-section",
                defaultText: item.description,
                displayProperty: "Description"
            });

            const stateOptions = ["Serviced", "Listed", "In Progress", "Sold", "Unknown"];
            componentFactory.createSelect({
                elementId: "#state-select",
                updateProperty: "state",
                parentElement: "#item-edit-section",
                options: stateOptions,
                defaultValue: item.state,
                additionalClasses: "live-item edit-gap-sizing",
                displayProperty: "State"
            });

            componentFactory.createTextBox({
                elementId: "#item-selling-price",
                updateProperty: "selling_price",
                parentElement: "#item-edit-section",
                additionalClasses: "live-item edit-gap-sizing",
                inputType: "float",
                defaultText: item.selling_price,
                displayProperty: "Selling Price"
            });

            componentFactory.createTextBox({
                elementId: "#item-quantity",
                updateProperty: "quantity",
                parentElement: "#item-edit-section",
                additionalClasses: "edit-gap-sizing",
                inputType: "integer",
                defaultText: item.quantity,
                displayProperty: "Quantity"
            });

            componentFactory.createTextBox({
                elementId: "#item-brand",
                updateProperty: "brand",
                parentElement: "#item-edit-section",
                additionalClasses: "edit-gap-sizing",
                inputType: "string",
                defaultText: item.brand,
                displayProperty: "Brand"
            });

            componentFactory.createTextBox({
                elementId: "#item-cost-price",
                updateProperty: "cost_price",
                parentElement: "#item-edit-section",
                additionalClasses: "edit-gap-sizing",
                inputType: "float",
                defaultText: item.cost_price,
                displayProperty: "Cost Price"
            });

            componentFactory.createTextBox({
                elementId: "#item-repair-price",
                updateProperty: "repair_price",
                parentElement: "#item-edit-section",
                additionalClasses: "edit-gap-sizing",
                inputType: "float",
                defaultText: item.repair_price,
                displayProperty: "Repair Price"
            });

            componentFactory.createTextBox({
                elementId: "#item-weight",
                updateProperty: "weight",
                parentElement: "#item-edit-section",
                additionalClasses: "edit-gap-sizing",
                inputType: "float",
                defaultText: item.weight,
                displayProperty: "Weight"
            });

            componentFactory.createTextBox({
                elementId: "#item-dimensions",
                updateProperty: "dimensions",
                parentElement: "#item-edit-section",
                additionalClasses: "edit-gap-sizing",
                inputType: "string",
                defaultText: item.dimensions,
                displayProperty: "Dimensions"
            });

            componentFactory.createAutocomplete({
                elementId: "#autocomplete-category",
                updateProperty: "category",
                parentElement: "#item-edit-section",
                additionalClasses: "edit-gap-sizing",
                displayProperty: "Category",
                defaultText: item.category,
            });

            const tableManager = new TableManager("itemList", "#item-table", "#item-filter-text");

            componentFactory.createDeleteItemButton({
                elementId: "#item-delete-button",
                parentElement: "#item-edit-section",
                additionalClasses: "btn btn-danger",
            },
                tableManager
            );

            tableManager.populateTable();

            $(".live-item").on("input", tableManager.populateTable.bind(tableManager));
        });
    }

    initializeInventoryPage() {
        this.#tableManager.attachFilterHandler();
        this.#tableManager.populateTable();

        $("#add-items-button").click(() => {
            this.loadItemEditor();
        });

        $("#export-items").click(() => {
            this.#localStorageManager.exportLocalStorageToFile("inventory");
        });

        $("#file-input").on("change", (event) => {
            const file = event.target.files[0];
            this.#localStorageManager.importJsonFileToLocalStorage(file);
            this.#tableManager.populateTable();
        });
    }
}
