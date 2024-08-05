import { openExistingItem } from "./item-editor.js";
import { LocalStorageManager } from "../localstorage-utils.js";

export class TableManager {
    #localStorageKey;
    #tableSelector;
    #filterSelector;
    #localStorageManager;

    constructor(localStorageKey, tableSelector, filterSelector) {
        this.#localStorageKey = localStorageKey;
        this.#tableSelector = tableSelector;
        this.#filterSelector = filterSelector;
        this.#localStorageManager = new LocalStorageManager();
    }

    populateTable() {
        console.log("Loading: item-table.html");
        $(this.#tableSelector).load("pages/inventory/item-table.html", () => {
            const items = this.#localStorageManager.getJsonItems(this.#localStorageKey);
            const $tableBody = $("#item-table-body");
            $tableBody.empty();
            let selectedState = $(this.#filterSelector).text();
            items.forEach(item => {
                if (item.state === selectedState) {
                    const row = `<tr class="interactive-row" data-id="${item.id}">
                        <td><input class="form-check-input" type="checkbox" value="" id="${item.id}"></td>
                        <td class="table-item">${item.name}</td>
                        <td class="table-item">&pound${item.selling_price}</td>
                    </tr>`;
                    $tableBody.append(row);
                }
            });
            this.#attachRowClickHandler();
        });
    }

    #attachRowClickHandler() {
        $(".interactive-row").click(function (event) {
            if (event.target.type !== "checkbox") {
                const itemId = $(this).data("id");
                openExistingItem(itemId);
            }
        });
    }

    attachFilterHandler() {
        $(".dropdown-item.filter-option").click((event) => {
            const selectedItemText = $(event.target).text();
            $(this.#filterSelector).text(selectedItemText);
            this.populateTable();
        });
    }
}

