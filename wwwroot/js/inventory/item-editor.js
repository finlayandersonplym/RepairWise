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
                <td>${item.name}</td>
                <td>${item.price}</td>
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

        $("#item-price").text(`${item.price}`);
    });
}

export function createNewItem() {
    console.log("Loading: add-item.html");

    $("#selection-loader").load("pages/inventory/new-item.html", () => {
        const skeleton = { id: "", name: "Unnamed Item", description: "", state: "", price: ""};
        const newId = addJsonItem("itemList", skeleton);

        // Add the default text and ID
        $("#item-name-text")
            .text("Unnamed Item")
            .attr("data-id", newId);

        $("#description-text").attr("data-id", newId);

        $("#state-select").attr("data-id", newId);

        $("#item-price").attr("data-id", newId);

        initializeEditableText("item-name", "name");
        initializeEditableBox("description-text", "description");
        initializeSelect("state-select", "state");
        initializeEditableBox("item-price", "price");
        $(".live-item").on("input", function () {
            populateTable();
        });
    });
}


