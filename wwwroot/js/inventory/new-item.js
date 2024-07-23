import { addJsonItem } from "../localstorage-utils.js"

export function newItem() {
    $("#add-items-button").click(() => {
        console.log("Loading: add-item.html");

        $("#selection-loader").load("pages/inventory/new-item.html", () => {
            const skeleton = { id: "", name: "Unnamed Item", description: "", state: "" };
            const newId = addJsonItem("itemList", skeleton);

            // Add the default text and ID
            $("#item-name-text")
                .text("Unnamed Item")
                .attr("data-id", newId);
        });
    });
}