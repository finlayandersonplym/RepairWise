import { addJsonItem } from "../localstorage-utils.js"
import { initializeEditableText } from "../components/editable-text.js";
import { initializeEditableBox } from "../components/text-box.js";
export function editExistingItem(itemId) {

}

export function createNewItem() {
    console.log("Loading: add-item.html");

    $("#selection-loader").load("pages/inventory/new-item.html", () => {
        const skeleton = { id: "", name: "Unnamed Item", description: "", state: "" };
        const newId = addJsonItem("itemList", skeleton);

        // Add the default text and ID
        $("#item-name-text")
            .text("Unnamed Item")
            .attr("data-id", newId);

        $("#description-text")
            .attr("data-id", newId);

        initializeEditableText("item-name", "name");
        initializeEditableBox("description-text", "description");
    });
}


