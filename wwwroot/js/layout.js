import { initializeInventoryPage } from "./inventory/inventory.js";
import { initalizeEvaluatePage } from "./evaluate/evaluate.js"
function activePage() {
    $(".nav-link").on("click", function (event) {
        event.preventDefault();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        let page = $(this).data("page");

        console.log("Loading: " + page + ".html");

        $("#page-content").load("pages/" + page + ".html", function () {
            if (page === 'inventory') {
                initializeInventoryPage();
            }
            if (page === 'evaluate') {
                initalizeEvaluatePage()
            }
        });
    });
}

$(document).ready(function () {
    activePage();
});
