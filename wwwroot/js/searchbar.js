import { InventoryManager } from "./inventory/item-editor.js";
import { LocalStorageManager } from "./localstorage-utils.js";
import { initializeInventoryPage } from "./inventory/inventory.js";

export function initializeSearchBar() {
    const localStorageManager = new LocalStorageManager();
    const items = localStorageManager.getJsonItems("itemList");
    const inventoryManager = new InventoryManager("itemList", "#item-table", "#item-filter-text");

    const autocompleteItems = items.map(item => ({
        label: item.name,
        description: item.description,
        id: item.id 
    }));

    $('#navbar-search').autocomplete({
        source: autocompleteItems,
        select: function (event, ui) {
            $("#page-content").load("pages/inventory.html", () => {
                initializeInventoryPage();
                inventoryManager.openExistingItem(ui.item.id); 
            });
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append(`<div><p>${item.label}</p><p>${item.description}</p></div>`)
            .appendTo(ul);
    };
}
