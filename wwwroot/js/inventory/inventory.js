import { InventoryManager } from "./item-editor.js"

export function initializeInventoryPage() {
    const inventoryManager = new InventoryManager("itemList", "#item-table", "#item-filter-text");
    inventoryManager.initializeInventoryPage();
}
