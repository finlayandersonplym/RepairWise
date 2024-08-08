import { LocalStorageManager } from "./localstorage-utils.js";

export function intitalizeSearchBar() {
    const localStorageManager = new LocalStorageManager();
    const items = localStorageManager.getJsonItems("itemList");

    $('#navbar-search').autocomplete({
        source: function (request, response) {
            const filteredItems = items.filter(item => item.name.toLowerCase().includes(request.term.toLowerCase()));
            response(filteredItems.map(item => ({
                label: item.name,
                value: item.name,
                description: item.description
            })));
        },
        select: function (event, ui) {
            // Handle the item selection (if needed)
            console.log('Selected:', ui.item);
        },
        open: function () {
            $('.ui-autocomplete').css('width', $('#navbar-search').outerWidth());
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append(`<div><p>${item.label}</p><p>${item.description}</p></div>`)
            .appendTo(ul);
    };
}
